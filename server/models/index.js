const fs        = require('fs')
const path      = require('path')
const Sequelize = require('sequelize')
const basename  = path.basename(module.filename)
const db        = {}

// require('../config/config') // FIXME:

const {database, dbUsername, dbPassword, dialect} = process.env

let sequelize
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize(database, dbUsername, dbPassword, {
    dialect
  })
}

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db