const models = require('../../models')

const unhashedPassword = ['superSecure', 'evenMoreSuperSecure']

const users = [
  {
    username: 'jesse',
    email: 'jesse@test.com',
    password: unhashedPassword[0]
  },
  {
    username: 'sam',
    email: 'sam@test.com',
    password: unhashedPassword[1]
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
