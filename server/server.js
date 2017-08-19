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

// middleware
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
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
    app.listen(port, () => console.log(`server listening on http://localhost:${port}`))
  })
  .catch(error => console.log(error))

// app export is currently for testing only
module.exports.app = app
