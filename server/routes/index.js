const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('hello world, this is the home page hehe its pretty bland huh?')
})

module.exports = router