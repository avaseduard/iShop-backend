const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { readdirSync } = require('fs') // Node.js file system
require('dotenv').config()

// App
const app = express()

// Database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DATABASE CONNECTION SUCCESS'))
  .catch(error => console.log(`DATABASE CONNECTION ERROR: ${error}`))

// Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '2mb' }))

// CORS configuration
if (process.env.NODE_ENV === 'development') {
  corsOptions = {
    origin: '*', // local development
    optionsSuccessStatus: 200, // for legacy browsers that choke on 204
  };
} else {
  corsOptions = {
    origin: 'https://ishop-frontend.onrender.com', // production
    optionsSuccessStatus: 200, // for legacy browsers that choke on 204
  };
}
app.use(cors(corsOptions))

// Middleware routes
readdirSync('./routes/').map(route =>
  app.use('/api', require('./routes/' + route))
) // use all routes from the routes directory

// Port
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on port ${port}`))
