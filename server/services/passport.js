const bcrypt = require('bcryptjs')
const passport = require('passport')
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local')

const models = require('../models/index')

// *** Local auth strategy ***
const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  let persistantUser
  models.Users
    .findOne({
      where: { email }
    })
    .then(user => {
      if (!user) { return done(null, false) }

      persistantUser = user

      return bcrypt.compare(password, user.password)
    })
    .then(passwordMatched => passwordMatched ? done(null, persistantUser) : done(null, false))
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
    .findOne({
      where: { id: payload.sub }
    })
    .then(user => {
      if (!user) { return done(null, false) }

      return done(null, user)
    })
    .catch(error => done(error, null))
})

passport.use(jwtLogin)
passport.use(localLogin)
