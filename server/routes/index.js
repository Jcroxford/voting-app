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
    19) refactor appropriate findAll's to use findById 
    21) use findOrCreate 
      http://docs.sequelizejs.com/manual/tutorial/models-usage.html (for 20 and 21)
    22) 
*/

// *** helper functions ***
function generateJwtForUser (user) {
  return jwt.sign({sub: user.id}, process.env.secret)
}

// *** User routes ***
router.post('/api/create/user', (req, res) => {
  const {username, email, password} = req.body

  // validate body info
  if (!username || !email || !password) { return res.json({ error: 'invalid input' }) }

  models.Users
    .findOne({
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
    .then(user => {
      if (user) throw new Error('username or email in use')

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
    .then(user => res.json({ token: generateJwtForUser(user) }))
    .catch(error => {
      // custom error handling
      switch (error.message) {
        case 'username or email in use':
          res.status(400).json({ error: error.message })
          break
        default:
          res.status(500).json({ error: 'internal error occured' })
          console.log(error)
      }
    })
})

router.post('/api/user/login', requireSignin, (req, res) => {
  res.json({ token: generateJwtForUser(req.user) })
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
    .then(() => res.json({ success: 'password updated successfully' }))
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
    .then(() => res.json({ success: 'poll created successfully' }))
    .catch(error => console.log(error))
})

router.get('/api/user/polls', requireAuth, (req, res) => {
  models.Polls
    .findAll({
      where: { UserId: req.user.id },
      attributes: ['id', 'title']
    })
    .then(polls => res.json({ polls }))
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'internal error' })
    })
})

router.get('/api/user/poll/delete/:pollId', requireAuth, (req, res) => {
  models.Polls
    .findOne({
      where: {
        id: req.params.pollId,
        UserId: req.user.id
      }
    })
    .then(poll => {
      if (!poll) {
        throw new Error('insufficient access to poll or poll does not exist')
      }

      return poll.destroy()
    })
    .then(() => res.json({ success: 'poll deleted successfully' }))
    .catch(error => {
      switch (error.message) {
        case 'insufficient access to poll or poll does not exist':
          res.status(401).json({ error: error.message })
          break
        default:
          console.log(error)
          res.status(500).json({ error: 'internal error' })
      }
    })
})

// *** public routes ***
router.get('/api/polls/:page', (req, res) => {
  models.Polls
    .findAndCountAll({
      limit: 12,
      offset: (req.params.page - 1) * 12,
      attributes: ['id', 'title']
    })
    .then(results => {
      res.json({
        totalPolls: results.count,
        polls: results.rows
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({error: 'internal error'})
    })
})

router.get('/api/polls/detail/:pollId', (req, res) => {
  models.PollOptions
    .findAll({
      where: {PollId: req.params.pollId},
      attributes: ['id', 'pollText', 'voteCount']
    })
    .then(pollOptions => res.json({ pollOptions }))
    .catch(error => {
      console.log(error)
      res.status(500).json({error: 'internal error'})
    })
})

router.get('/api/poll/vote/:pollOptionId', (req, res) => {
  models.PollOptions
    .increment('voteCount', { where: { id: req.params.pollOptionId } })
    .then(results => {
      // wtf sequelize? why you have so many nested arrays?
      if (!results[0][0].length) { throw new Error('poll option does not exist') }

      const updatedPollOption = results[0][0][0]
      res.json({ updatedVoteCount: updatedPollOption.voteCount })
    })
    .catch(error => {
      switch (error.message) {
        case 'poll option does not exist':
          res.status(400).json({ error: error.message })
          break
        default:
          console.log(error)
          res.status(500).json({ error: 'internal error' })
      }
    })
})

module.exports = router
