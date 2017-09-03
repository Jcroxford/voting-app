const jwt = require('jsonwebtoken')
const secret = require('../config/secret').secret

const generateJwtForUser = (user) => {
  return jwt.sign({sub: user.id}, secret)
}

module.exports = {
  generateJwtForUser
}
