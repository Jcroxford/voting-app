const request = require('supertest')
const expect = require('chai').expect

const {app} = require('../../server')
const {users, populateUsers} = require('../seed/seed')

beforeEach(populateUsers)

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
