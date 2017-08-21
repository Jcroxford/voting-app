const jwt = require('jsonwebtoken')

const generateJwtForUser = (user) => {
  return jwt.sign({sub: user.id}, process.env.secret)
}

module.exports = {
  generateJwtForUser
}
