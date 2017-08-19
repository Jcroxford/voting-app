const request = require('supertest')
const expect = require('chai').expect
const {app} = require('../../server')

describe('/api/create/user', () => {
  it('should create a new user if no other errors apply', (done) => {
    const user = {
      username: 'jesse',
      email: 'jesse@email.com',
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
