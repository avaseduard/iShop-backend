const User = require('../model/user')

exports.createOrUpdateUser = async (req, res) => {
  // Get user's info from authCheck middleware
  const { name, email, picture } = req.user
  // Find an existing user by email property (first argument), update picture and name (second argument); return the updated user document in the user variable (third argument)
  const user = await User.findOneAndUpdate(
    { email: email },
    { name: email.split('@')[0], picture: picture },
    { new: true }
  )
  // If the user exists send the response; if not, create a new user using the constructor, save it in db and send the response
  if (user) {
    console.log('USER UPDATED', user)
    res.json(user)
  } else {
    const newUser = await new User({
      email: email,
      name: email.split('@')[0],
      picture: picture,
    }).save()
    res.json(newUser)
    console.log('USER CREATED', newUser)
  }
}

// Find the user based on the e-mail we have in req.user; execute the action of sending the user, if available in db
exports.currentUser = (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err)
    res.json(user)
  })
}
