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

const polls = [
  {
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
  },
  {
    title: 'poll 2',
    options: [
      {
        pollText: 'option 1'
      },
      {
        pollText: 'option 2'
      },
      {
        pollText: 'option 3'
      }
    ]
  }
]

const populatePolls = (done) => {
  models.Users
    .findOne({ where: { email: users[0].email } })
    .then(user => {
      const creatingPolls = []

      for (const poll of polls) {
        creatingPolls.push(
          models.Polls
            .create({
              UserId: user.id,
              title: poll.title,
              PollOptions: poll.options
            },
            {
              include: [models.PollOptions]
            })
        )
      }

      return Promise.all(creatingPolls)
    })
    .then(() => done())
    .catch(error => done(error))
}

const destroyPolls = (done) => {
  models.PollOptions
    .destroy({ where: {} })
    .then(() => models.Polls.destroy({ where: {} }))
    .then(() => done())
    .catch(error => done(error))
}

module.exports = {
  populateUsers,
  users,
  populatePolls,
  destroyPolls,
  polls
}
