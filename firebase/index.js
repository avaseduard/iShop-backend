// // OLD CODE
// // Initialize firebase admin tool
// var admin = require('firebase-admin')

// var serviceAccount = require('../config/fbServiceAccountKey.json')

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// })

// module.exports = admin

// NEW CODE
// Install dotenv by running: npm install dotenv
require('dotenv').config()

var admin = require('firebase-admin')

// Access the FB_SERVICE_ACCOUNT_KEY from the environment variables
const serviceAccount = JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY || '{}')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

module.exports = admin