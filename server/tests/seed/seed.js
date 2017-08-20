const models = require('../../models')
const { generateJwtForUser } = require('../../utils/jwtUtils')

const users = [
  {
    username: 'jesse',
    email: 'jesse@test.com',
    password: 'superSecure'
  },
  {
    username: 'sam',
    email: 'sam@test.com',
    password: 'evenMoreSuperSecure'
  }
]

const populateUsers = (done) => {
  models.Users
    .destroy({ where: {} })
    .then(() => {
      const hashedUsers = []

      for (let user of users) {
        hashedUsers.push(models.Users.create(user))
      }

      return Promise.all(hashedUsers)
    })
    .then(() => done())
    .catch(error => done(error))
}

module.exports = {
  populateUsers,
  users
}
