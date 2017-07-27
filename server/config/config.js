const env = process.env.NODE_ENV || 'development'

if(env === 'development' || env === 'test') {
  const config = require('./config.json') // custom env variables used for dev & testing
  const envConfig = config[env]

  // assing custom variables to process.env
  Object.keys(envConfig).forEach( key => process.env[key] = envConfig[key])
}