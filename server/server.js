const bodyParser = require('body-parser')
const express = require('express')
const favicon = require('serve-favicon')
const logger = require('morgan')
const path = require('path')

// routes
const router = require('./routes/index')

// custom env variables
require('./config/config')

// environment variables
const app = express()
const port = process.env.port
const testing = process.env.NODE_ENV === 'test'

// middleware
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
if (!testing) { app.use(logger('dev')) } // prevent logging during mocha testing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', router)

// catch all (404) route handler
app.use((req, res) => {
  res.status(404).send('404 page not found')
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
