const request = require('supertest')
const expect = require('chai').expect

const { app } = require('../../server')
const { users, populateUsers, populatePolls, destroyPolls } = require('../seed/seed')

const models = require('../../models')
const { generateJwtForUser } = require('../../utils/jwtUtils')

beforeEach(populateUsers)

// as of this writing, I could not figure out a way to generate a dynamic token cleanly
// inside of seed.js so I chose to write the callback inside of this file instead
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

describe('/api/create/user', () => {
  it('should return error when not given the correct parameters (username, email, password)', (done) => {
    const user = {
      // leaves out username for this test to qualify as invalid user
      email: 'jesse@email.com',
      password: 'root'
    }

    request(app)
      .post('/api/create/user')
      .send(user)
      .expect(400)
      .expect(res => expect(res.body).to.include({error: 'invalid input'}))
      .end(done)
  })

  it('should return error when username or email is already stored in the database', (done) => {
    const user = users[0]

    request(app)
      .post('/api/create/user')
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
      .post('/api/create/user')
      .send(user)
      .expect(200)
      .expect(res => expect(res.body).to.have.all.keys('token'))
      .end(done)
  })
})

describe('/api/user/login', () => {
  it('should return error if given invalid email', (done) => {
    const user = {
      email: 'invalid email',
      password: 'root'
    }

    request(app)
      .post('/api/user/login')
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
      .post('/api/user/login')
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
      .post('/api/user/login')
      .send(user)
      .expect(200)
      .expect(res => expect(res.body).to.have.all.keys('token'))
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

describe('/api/create/poll', () => {
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
      .post('/api/create/poll')
      .send(poll)
      .expect(401)
      .expect(res => expect(res.unauthorized).to.be.true)
      .end(done)
  })

  it('should create a poll if given a valid jwt', (done) => {
    request(app)
      .post('/api/create/poll')
      .set('authorization', token)
      .send(poll)
      .expect(200)
      .expect(res => expect(res.body).to.include({ success: 'poll created successfully' }))
      .end(done)
  })
})

describe('/api/polls/:page', () => {

  beforeEach(populatePolls)

  it('should return a valid response (json with totalPolls count and array of polls)', (done) => {
    // does not have authorization header attached
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
