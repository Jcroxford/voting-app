const bcrypt = require('bcrypt')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const models = require('../models/index')

/* general things left to do for routes
    1) delete poll route (must be authenticated)
    2) salt user password
    3) change password/users settings route
    4) passport authentication with twitter/github
    5) user authenticated route to view their existing polls
    6) user authenticated route to create a new poll
    7) accept vote route
    8) get all/group of polls route
    9) get detailed single poll route
    10) get detailed single poll route as an authenticated user? (maybe not needed)
    11) handle errors better
*/

// *** User routes ***
router.post('/api/create/user', (req, res) => {
  const {username, email, password} = req.body

  // validate body info
  if (!username || !email || !password) return res.json({error: 'invalid input'})

  models.Users
    .findAll({
      where: {
        $or: [
          {
            username: {
              $eq: req.body.username
            }
          },
          {
            email: {
              $eq: req.body.email
            }
          }
        ]
      }
    })
    .then(users => {
      if (users.length) throw new Error('username or email in use')

      return models.Users
        .create({
          username,
          email,
          password
        })
    })
    .then(user => jwt.sign({username: username}, 'tempsecretkey'))
    .then(token => res.header('x-auth', token).json({success: 'user created successfully'}))
    .catch(error => {
      // custom error handling
      switch (error.message) {
        case 'username or email in use':
          res.status(400).json({error: error.message})
          break
      }
    })
})

router.post('/api/create/poll', (req, res) => {
  const token = req.get('x-auth')

  if (!token) return res.status(400).json({error: 'no auth token present'})

  // confirm valid token
  try {
    var decoded = jwt.verify(token, 'tempsecretkey')
  } catch (error) {
    return res.status(400).json({error: error.message})
  }

  // verify user and insert
  models.Users
    .findAll({
      limit: 1,
      where: {
        username: decoded.username
      },
      attributes: ['id']

    })
    .then(users => users[0].id)
    .then(UserId => {
      models.Polls
        .create({
          UserId,
          title: req.body.title,
          PollOptions: req.body.options
        },
        {
          include: [models.PollOptions]
        })
    })
    .then(poll => res.json(poll))
    .catch(error => console.log(error))
})

module.exports = router
