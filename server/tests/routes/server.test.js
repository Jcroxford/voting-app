const request = require('supertest')
const expect = require('chai').expect

const { app } = require('../../server')
const { users, populateUsers } = require('../seed/seed')

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
      .expect(res => {
        expect(res.body).to.have.all.keys('token')
      })
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
      .expect(res => {
        expect(res.body).to.include({ success: 'poll created successfully' })
      })
      .end(done)
  })
})
