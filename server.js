const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { readdirSync } = require('fs') // node js file system
require('dotenv').config()

// app
const app = express()

// db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DATABASE CONNECTION SUCCES'))
  .catch(error => console.log(`DATABASE CONNECTION ERROR: ${error}`))

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '2mb' }))
// app.use(cors())

// Set middleware of CORS
app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://ishop-frontend.onrender.com/'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers'
  )
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Private-Network', true)
  res.setHeader('Access-Control-Max-Age', 7200)
  next()
})
// Set preflight
app.options('*', (req, res) => {
  console.log('preflight')
  if (
    req.headers.origin === 'https://ishop-frontend.onrender.com/' &&
    allowMethods.includes(req.headers['access-control-request-method']) &&
    allowHeaders.includes(req.headers['access-control-request-headers'])
  ) {
    console.log('pass')
    return res.status(204).send()
  } else {
    console.log('fail')
  }
})

// middleware routes
readdirSync('./routes/').map(route =>
  app.use('/api', require('./routes/' + route))
) // use all routes from the routes directory

//  port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
