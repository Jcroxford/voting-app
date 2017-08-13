// const fs = require('fs')
// const path = require('path')
const Sequelize = require('sequelize')

// load custom env variables
require('../config/config')

const {database, dbUsername, dbPassword, dialect} = process.env

let sequelize
if (process.env.environment === 'development' || process.env.environment === 'test') {
  sequelize = new Sequelize(database, dbUsername, dbPassword, {
    dialect,
    pool: {
      max: 9,
      min: 0,
      idle: 1000
    }
  })
}

// load schema modules
// let db = {}
// fs.readdirSync(__dirname)
//   .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
//   .forEach(file => {
//     const model = sequelize.import(path.join(__dirname, file))
//     db[model.name] = model
//   })

// Object.keys(db).forEach(modelName => {
//   if ('associate' in db[modelName]) {
//     db[modelName].associate(db)
//   }
// })

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize

db.Users = require('./Users')(sequelize, Sequelize)
db.Polls = require('./Polls')(sequelize, Sequelize)
db.PollOptions = require('./PollOptions')(sequelize, Sequelize)

db.Polls.belongsTo(db.Users)
db.Users.hasMany(db.Polls)
db.PollOptions.belongsTo(db.Polls)
db.Polls.hasMany(db.PollOptions)

module.exports = db
