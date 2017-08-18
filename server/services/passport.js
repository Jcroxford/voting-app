const bcrypt = require('bcryptjs')
const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local')

const models = require('../models/index')

// *** Local auth strategy ***
const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  let user
  models.Users
    .findAll({
      limit: 1,
      where: { email }
    })
    .then(users => {
      if (!users.length) { return done(null, false) }

      user = users[0]
      return bcrypt.compare(password, user.password)
    })
    .then(passwordMatched => passwordMatched ? done(null, user) : done(null, false))
    .catch(error => done(error, false))
})

// *** jwt auth strategy ***
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.secret
}

// payload == decoded jwt doken (if it exists)
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
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
passport.use(localLogin)
