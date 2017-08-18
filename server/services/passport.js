const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const models = require('../models/index')
console.log('secret from passport file', process.env.secret)
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.secret
}

// payload is decoded jwt doken (if it exists)
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  models.Users
    .findAll({
      limit: 1,
      where: { id: payload.sub }
    })
    .then(users => {
      if (!users.length) { return done(null, false) }

      return done(null, users[0])
    })
    .catch(error => done(error, null))
})

passport.use(jwtLogin)
