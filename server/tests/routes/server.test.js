const request = require('supertest')
const expect = require('chai').expect

const { app } = require('../../server')
const {
  users,
  populateUsers,
  populatePolls,
  destroyPolls,
  polls
} = require('../seed/seed')

const models = require('../../models')
const { generateJwtForUser } = require('../../utils/jwtUtils')

beforeEach(populateUsers)

describe('user/authenticated routes', () => {
  // as of this writing, I could not figure out a way to generate variables dynamically and cleanly
  // inside of seed.js so I chose to write the callbacks for these hooks inside of this file instead
  let token
  beforeEach((done) => {
    models.Users
      .findOne({ where: { email: users[0].email } })
      .then(user => {
        token = generateJwtForUser(user)
        done()
      })
      .catch(error => done(error))
  })

  describe('/api/signup/emailIsUsed/:email', () => {
    it('should return false if given an email that does not exist in the database', (done) => {
      const unusedEmail = 'notUsed@email.net'

      request(app)
        .get(`/api/signup/emailIsUsed/${unusedEmail}`)
        .expect(200)
        .expect(res => expect(res.body.used).to.be.false)
        .end(done)
    })

    it('should return true if given an email that does exist in the database', (done) => {
      request(app)
        .get(`/api/signup/emailIsUsed/${users[0].email}`)
        .expect(200)
        .expect(res => expect(res.body.used).to.be.true)
        .end(done)
    })
  })

  describe('/api/signup/usernameIsUsed/:username', () => {
    it('should return false if given a username that does not exist in the database', (done) => {
      const unusedUsername = 'thisUsernameIsNotUsedAhywnere'

      request(app)
        .get(`/api/signup/usernameIsUsed/${unusedUsername}`)
        .expect(200)
        .expect(res => expect(res.body.used).to.be.false)
        .end(done)
    })

    it('should return true if given a username that does exist in the database', (done) => {
      request(app)
        .get(`/api/signup/usernameIsUsed/${users[0].username}`)
        .expect(200)
        .expect(res => expect(res.body.used).to.be.true)
        .end(done)
    })
  })

  describe('/api/signup', () => {
    it('should return error when not given the correct parameters (username, email, password)', (done) => {
      const user = {
        // leaves out username for this test to qualify as invalid user
        email: 'jesse@email.com',
        password: 'root'
      }

      request(app)
        .post('/api/signup')
        .send(user)
        .expect(400)
        .expect(res => expect(res.body).to.include({error: 'invalid input'}))
        .end(done)
    })

    it('should return error when username or email is already stored in the database', (done) => {
      const user = users[0]

      request(app)
        .post('/api/signup')
        .send(user)
        .expect(400)
        .expect(res => expect(res.body).to.include({error: 'username or email in use'}))
        .end(done)
    })

    it('should create a new user if no other errors apply', (done) => {
      const user = {
        username: 'joe',
        email: 'joe@email.com',
        password: 'root'
      }

      request(app)
        .post('/api/signup')
        .send(user)
        .expect(200)
        .expect(res => expect(res.body).to.have.all.keys(['token', 'username']))
        .end(done)
    })
  })

  describe('/api/signin', () => {
    it('should return error if given invalid email', (done) => {
      const user = {
        email: 'invalid email',
        password: 'root'
      }

      request(app)
        .post('/api/signin')
        .send(user)
        .expect(401)
        .expect(res => expect(res.unauthorized).to.be.true)
        .end(done)
    })

    it('should return error if given valid username or email and invalid password', (done) => {
      const user = {
        email: users[0].email,
        password: 'invalid password'
      }

      request(app)
        .post('/api/signin')
        .send(user)
        .expect(401)
        .expect(res => expect(res.unauthorized).to.be.true)
        .end(done)
    })

    it('should authenticate and return a jwt and json response with username', (done) => {
      const user = {
        email: users[0].email,
        password: users[0].password
      }
      
      request(app)
        .post('/api/signin')
        .send(user)
        .expect(200)
        .expect(res => expect(res.body).to.have.all.keys(['token', 'username']))
        .end(done)
    })
  })

  describe('/api/user/password/change', () => {
    it('should return error if given invalid jwt', (done) => {
      const invalidToken = 'not a valid token'
      const changeAttempt = {
        passwordAttempt: users[0],
        newPassword: users[0]
      }

      request(app)
        .post('/api/user/password/change')
        .set('authorization', invalidToken)
        .send(changeAttempt)
        .expect(401)
        .expect(res => expect(res.unauthorized).to.be.true)
        .end(done)
    })

    it('should return error if not given valid current password', (done) => {
      const changeAttempt = {
        passwordAttempt: 'not the correct password',
        newPassword: users[0]
      }

      request(app)
        .post('/api/user/password/change')
        .set('authorization', token)
        .send(changeAttempt)
        .expect(400)
        .expect(res => expect(res.body).to.include({ error: 'password incorrect' }))
        .end(done)
    })

    it('should return success value if password was changed successfully', (done) => {
      const changeAttempt = {
        passwordAttempt: users[0].password,
        newPassword: 'aNewP4$$w0rD'
      }

      request(app)
        .post('/api/user/password/change')
        .set('authorization', token)
        .send(changeAttempt)
        .expect(200)
        .expect(res => expect(res.body).to.include({ success: 'password updated successfully' }))
        .end(done)
    })
  })

  describe('/api/user/createPoll', () => {
    const poll = {
      title: 'greek?',
      options: [
        {
          pollText: 'Lorem?'
        },
        {
          pollText: 'ipsum?'
        },
        {
          pollText: 'dolor?'
        }
      ]
    }

    it('should return error if route is not authenticated', (done) => {
      // does not have authorization header attached
      request(app)
        .post('/api/user/createPoll')
        .send(poll)
        .expect(401)
        .expect(res => expect(res.unauthorized).to.be.true)
        .end(done)
    })

    it('should create a poll if given a valid jwt', (done) => {
      request(app)
        .post('/api/user/createPoll')
        .set('authorization', token)
        .send(poll)
        .expect(200)
        .expect(res => expect(res.body).to.have.all.keys(['pollId', 'title']))
        .end(done)
    })
  })

  describe('/api/user/polls', () => {
    beforeEach(populatePolls)

    it('should return unathenticated if authorization header is not present or is invalid', (done) => {
      request(app)
        .get('/api/user/polls')
        .set('authorization', `fake${token}`)
        .expect(401)
        .expect(res => expect(res.unauthorized).to.be.true)
        .end(done)
    })

    it('should return user polls based on user provided in authentication header', (done) => {
      request(app)
        .get('/api/user/polls')
        .set('authorization', token)
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.all.keys(['polls'])
        })
        .end(done)
    })

    afterEach(destroyPolls)
  })

  describe('/api/user/poll/delete/:pollId', () => {
    beforeEach(populatePolls)

    let pollOptionId
    beforeEach((done) => {
      models.PollOptions
        .findOne({ where: { pollText: polls[0].options[0].pollText } })
        .then(pollOption => {
          pollOptionId = pollOption.id
          done()
        })
        .catch(error => done(error))
    })

    it('should return error if not given a proper jwt authorization', (done) => {
      request(app)
        .get(`/api/user/poll/delete/${pollOptionId}`)
        .set('authorization', `fake${token}`)
        .expect(401)
        .expect(res => expect(res.unauthorized).to.be.true)
        .end(done)
    })

    it('should return error if attempting to delete a poll that the user does not own or does not exist', (done) => {
      pollOptionId = 0

      request(app)
        .get(`/api/user/poll/delete/${pollOptionId}`)
        .set('authorization', token)
        .expect(401)
        .expect(res => expect(res.body).to.include({ error: 'insufficient access to poll or poll does not exist' }))
        .end(done)
    })

    it('should update poll and return valid json with incremented poll option vote count if given a proper poll option id', (done) => {
      request(app)
        .get(`/api/poll/vote/${pollOptionId}`)
        .expect(200)
        .expect(res => expect(res.body).to.have.all.keys(['updatedVoteCount']))
        .end(done)
    })

    afterEach(destroyPolls)
  })
// should return success value if user is authorized and attempts to delete one of their own polls

})

describe('global/public routes', () => {
  describe('/api/polls/:page', () => {
    beforeEach(populatePolls)

    it('should return a valid response (json with totalPolls count and array of polls)', (done) => {
      request(app)
        .get('/api/polls/1')
        .expect(200)
        .expect(res => expect(res.body).to.have.all.keys(['totalPolls', 'polls']))
        .end(done)
    })

    it('should return valid count but an empty polls array if page count is to high', (done) => {
      request(app)
        .get('/api/polls/500')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.all.keys(['totalPolls', 'polls'])
          expect(res.body.polls).to.be.empty
        })
        .end(done)
    })

    afterEach(destroyPolls)
  })

  describe('/api/polls/detail/:pollId', () => {
    beforeEach(populatePolls)

    let pollId
    beforeEach((done) => {
      models.Polls
        .findOne({ where: { title: polls[0].title } })
        .then(poll => {
          pollId = poll.id
          done()
        })
        .catch(error => done(error))
    })

    it('should return a json object with a poll\'s poll options and their voteCount', (done) => {
      request(app)
        .get(`/api/polls/detail/${pollId}`)
        .expect(200)
        .expect(res => {
          for (const pollOption of res.body.pollOptions) {
            expect(pollOption).to.have.all.keys(['id', 'pollText', 'voteCount'])
          }
        })
        .end(done)
    })

    afterEach(destroyPolls)
  })

  describe('/api/poll/vote/:pollOptionId', () => {
    beforeEach(populatePolls)

    let pollOptionId
    beforeEach((done) => {
      models.PollOptions
        .findOne({ where: { pollText: polls[0].options[0].pollText } })
        .then(pollOption => {
          pollOptionId = pollOption.id
          done()
        })
        .catch(error => done(error))
    })

    it('should return error if given an invalid poll option id', (done) => {
      pollOptionId = 0

      request(app)
        .get(`/api/poll/vote/${pollOptionId}`)
        .expect(400)
        .expect(res => expect(res.body).to.include({ error: 'poll option does not exist' }))
        .end(done)
    })

    afterEach(destroyPolls)
  })
})
