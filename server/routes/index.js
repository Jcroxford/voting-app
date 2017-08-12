const express = require('express')
const router = express.Router()

const models = require('../models/index')

router.get('/', (req, res) => {
  res.send('hello world, this is the home page hehe its pretty bland huh?')
})

router.post('/api/createUser', (req, res) => {
  models.Users
    .create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    .then(user => res.json(user))
    .catch(error => console.log(error))
})

module.exports = router
