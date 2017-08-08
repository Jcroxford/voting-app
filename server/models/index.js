const fs        = require('fs')
const path      = require('path')
const Sequelize = require('sequelize')
const basename  = path.basename(module.filename)
const db        = {}

const {database, dbUsername, dbPassword, dialect} = process.env

let sequelize
if(process.env.environment === 'development' || process.env.environment === 'test') {
  sequelize = new Sequelize(database, dbUsername, dbPassword, {
    dialect
  })
}

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db