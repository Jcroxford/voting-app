const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const DataTypes = require('sequelize/lib/data-types')

// const {database, dbUsername, dbPassword, dialect} = process.env FIXME: add back in once done with db isolation testing

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

// FIXME: for isolated db testing
const database = 'voting-app-dev'
const dbUsername = 'root'
const dbPassword = 'root'
const dialect = 'postgres'
sequelize = new Sequelize(database, dbUsername, dbPassword, {
  dialect,
  pool: {
    max: 9,
    min: 0,
    idle: 1000
  }
})

const Polls = sequelize.define('Polls', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

Polls.sync({force: true})
  .then(() => {
    return Polls.create({
      title: 'this is a test poll'
    })
  })
  .then(() => Polls.findAll())
  .then(polls => console.log(polls))
// end isolation testing variables/config

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

// db.sequelize = sequelize
// db.Sequelize = Sequelize

// module.exports = db

// FIXME: temporary for isolated db testing

sequelize.authenticate()
  .then(() => console.log('connected to db successfully'))
  .catch(error => console.log('error', error))
