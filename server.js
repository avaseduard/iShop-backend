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
app.use(cors())

// middleware routes
readdirSync('./routes/').map(route =>
  app.use('/api', require('./routes/' + route))
) // use all routes from the routes directory

//  port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
