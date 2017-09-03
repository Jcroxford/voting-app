const Sequelize = require('sequelize')

// load custom env variables
require('../config/config')

const {database, dbUsername, dbPassword, dialect} = process.env

let sequelize
if (process.env.environment === 'development' || process.env.environment === 'test') {
  sequelize = new Sequelize(database, dbUsername, dbPassword, {
    dialect,
    logging: false,
    pool: {
      max: 9,
      min: 0,
      idle: 1000
    }
  })
} else {
  sequelize = new Sequelize(process.env.DATABASE_URI)
}

// load schema modules
const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

db.Users = require('./Users')(sequelize, Sequelize)
db.Polls = require('./Polls')(sequelize, Sequelize)
db.PollOptions = require('./PollOptions')(sequelize, Sequelize)

db.Polls.belongsTo(db.Users)
db.Users.hasMany(db.Polls)
db.PollOptions.belongsTo(db.Polls, { onDelete: 'CASCADE' })
db.Polls.hasMany(db.PollOptions)

module.exports = db
