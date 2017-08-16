const express = require('express')
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

// *** api routes ***
// User routes
router.post('/api/createuser', (req, res) => {
  models.Users
    .create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    .then(user => res.json(user))
    .catch(error => console.log(error))
})

router.post('/api/createpoll', (req, res) => {
  models.Polls
    .create({
      title: req.body.title,
      PollOptions: req.body.options
    },
    {
      include: [models.PollOptions]
    })
    .then(poll => res.json(poll))
    .catch(error => console.log(error))
})

module.exports = router
