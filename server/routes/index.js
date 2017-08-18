const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const models = require('../models/index')

/* general things left to do for routes
    1) delete poll route (must be authenticated)
    5) user authenticated route to view their existing polls
    6) user authenticated route to create a new poll
    7) accept vote route(public)
    8) get all/group of polls route
    9) get detailed single poll route
    10) get detailed single poll route as an authenticated user? (maybe not needed)
    11) handle errors better
    15) add a real hidden secret key for jwt generation and authentication
    16) make code more dry with controller functions?
    17) add restrictions to password(length certain characters needed etc)
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

      return bcrypt.genSalt(10)
    })
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      return models.Users
        .create({
          username,
          email,
          password: hashedPassword
        })
    })
    .then(user => jwt.sign({username}, 'tempsecretkey'))
    .then(token => res.header('x-auth', token).json({success: 'user created successfully'}))
    .catch(error => {
      // custom error handling
      switch (error.message) {
        case 'username or email in use':
          res.status(400).json({error: error.message})
          break
        default:
          res.status(500).json({error: 'internal error occured'})
          console.log(error)
      }
    })
})

router.post('/api/user/login', (req, res) => {
  const {userIdentifier, password} = req.body // userIdentifier can be either a user's email or username

  let user
  models.Users
    .findAll({
      limit: 1,
      where: {
        $or: [
          {
            username: {
              $eq: userIdentifier
            }
          },
          {
            email: {
              $eq: userIdentifier
            }
          }
        ]
      },
      attributes: ['username', 'password']
    })
    .then(users => {
      if (!users.length) throw new Error('user not found')

      user = users[0]

      return bcrypt.compare(password, user.password)
    })
    .then(passwordMatched => {
      if (!passwordMatched) throw new Error('password incorrect')

      return jwt.sign({username: user.username}, 'tempsecretkey')
    })
    .then(token => res.header('x-auth', token).json({username: user.username}))
    .catch(error => {
      switch (error.message) {
        case 'user not found':
          res.status(400).json({error: 'user not found'})
          break
        case 'password incorrect':
          res.status(400).json({error: 'password incorrect'})
          break
        default:
          res.status(500).json({error: 'internal error occured'})
          console.log(error)
      }
    })
})

router.post('/api/user/password/change', (req, res) => {
  const token = req.get('x-auth')
  const {currentPassword, newPassword} = req.body

  if (!token) return res.status(400).json({error: 'no auth token present'})

  // confirm valid token
  try {
    var decoded = jwt.verify(token, 'tempsecretkey')
  } catch (error) {
    return res.status(400).json({error: error.message})
  }

  // verify user and password
  models.Users
    .findAll({
      limit: 1,
      where: {
        username: decoded.username
      },
      attributes: ['password']
    })
    .then(users => users[0].password)
    .then(userPassword => bcrypt.compare(currentPassword, userPassword))
    .then(passwordMatched => {
      if (!passwordMatched) throw new Error('password incorrect')

      return bcrypt.genSalt(10)
    })
    .then(salt => bcrypt.hash(newPassword, salt))
    .then(newHashedPassword => {
      models.Users.update(
        {
          password: newHashedPassword
        },
        {
          where: {
            username: decoded.username
          }
        })
    })
    .then(() => res.json({success: 'password updated successfully'}))
    .catch(error => {
      switch (error.message) {
        case 'password incorrect':
          res.status(400).json({error: 'password incorrect'})
          break
        default:
          res.status(500).json({error: 'internal error'})
          console.log(error)
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
      return models.Polls
        .create({
          UserId,
          title: req.body.title,
          PollOptions: req.body.options
        },
        {
          include: [models.PollOptions]
        })
    })
    .then(() => res.json({success: 'poll created successfully'}))
    .catch(error => console.log(error))
})

module.exports = router
