const bodyParser = require('body-parser')
const express    = require('express')
const favicon    = require('serve-favicon')
const logger     = require('morgan')
const path       = require('path')

require('./config/config')
// environment variables
const app  = express()
const port = process.env.PORT

// TODO: app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// catch all (404) route handler
app.use((req, res) => {
  res.status(404).send('404 page not found')
})

app.listen(port, () => console.log(`server listening on http://localhost:${port}`))