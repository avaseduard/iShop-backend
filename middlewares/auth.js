const admin = require('../firebase')
const User = require('../model/user')

exports.authCheck = async (req, res, next) => {
  // Verify token in firebase
  try {
    // If successful, it will return the user
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken)
    // Add the firebase user to the req argument, so we can access it where needed
    req.user = firebaseUser
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      error: 'Invalid or expired token',
    })
  }
}

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user
  // Find user in database by email address
  const adminUser = await User.findOne({ email: email }).exec()
  // Check if the user is an admin and go the next function only if that is the case
  if (adminUser.role !== 'admin') {
    res.status(403).json({
      error: 'Admin resource. Acces denied.',
    })
  } else {
    next()
  }
}
