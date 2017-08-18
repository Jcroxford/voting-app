const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const models = require('../models/index')

const passportService = require('../services/passport') // used automagically by passport
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })
/* general things left to do for routes
    1) delete poll route (must be authenticated)
    5) user authenticated route to view their existing polls
    7) accept vote route(public) figure out how to prevent a user for voting on one poll more than once ip?
    8) get all/group of polls route
    9) get detailed single poll route
    11) handle errors better
    17) add restrictions to password(length certain characters needed etc)
    19)
*/

// *** helper functions ***
function generateJwtForUser (user) {
  return jwt.sign({sub: user.id}, process.env.secret)
}

// *** User routes ***
router.post('/api/create/user', (req, res) => {
  const {username, email, password} = req.body

  // validate body info
  if (!username || !email || !password) { return res.json({error: 'invalid input'}) }

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
    .then(user => res.json({token: generateJwtForUser(user)}))
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

router.post('/api/user/login', requireSignin, (req, res) => {
  res.json({token: generateJwtForUser(req.user)})
})

router.post('/api/user/password/change', requireAuth, (req, res) => {
  const {currentPassword, newPassword} = req.body

  // // verify user and password
  bcrypt.compare(currentPassword, req.user.password)
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
            id: req.user.id
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

router.post('/api/create/poll', requireAuth, (req, res) => {
  // verify user and insert
  models.Polls
    .create({
      UserId: req.user.id,
      title: req.body.title,
      PollOptions: req.body.options
    },
    {
      include: [models.PollOptions]
    })
    .then(() => res.json({success: 'poll created successfully'}))
    .catch(error => console.log(error))
})

module.exports = router
