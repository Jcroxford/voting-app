const bodyParser = require('body-parser')
const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')
const path = require('path')
const cors = require('cors')

// routes
const router = require('./routes/index')

// custom env variables
require('./config/config')

// environment variables
const app = express()
const port = process.env.port || process.env.PORT
const testing = process.env.NODE_ENV === 'test'

// middleware
if (!testing) { app.use(logger('dev')) } // prevent logging during mocha testing
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// handles all rest api requests
app.use('/api', router)

// serves up front end
app.use(express.static(path.resolve(__dirname, '../client/build')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build/index.html'))
})

// database connect 
const models = require('./models/index')

models.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      // prevent start message during testing
      if (!testing) {
        console.log(`server listening on http://localhost:${port}`)
      }
    })
  })
  .catch(error => console.log(error))

// app export is currently for testing only
module.exports.app = app
