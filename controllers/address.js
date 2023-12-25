const User = require('../model/user')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    // Find user in db based on email form fe and udpate the address with what we receive from fe
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $addToSet: {
          addresses: {
            location: req.body.address,
            slug: slugify(req.body.address),
          },
        },
      }
    ).exec()
    // Send confirmation to fe
    res.json({ ok: true })
  } catch (error) {
    console.log('ADDRESS CREATE FAILED IN BE -->', error)
  }
}

exports.list = async (req, res) => {
  try {
    const addresses = await User.find(
      { email: req.user.email },
      { addresses: 1 }
    ).exec()
    res.json(addresses)
  } catch (error) {
    console.log('COLOR LIST FAILED IN BE -->', error)
  }
}

exports.remove = async (req, res) => {
  try {
    // Get the product id from url
    const { slug } = req.params
    // Find the user in db based on email and pull the address from addresses based on slug
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { addresses: { slug: slug } } }
    ).exec()
    // Send confirmation to fe
    res.json({ ok: true })
  } catch (error) {
    console.log('ADDRESS REMOVE FAILED IN BE -->', error)
  }
}

exports.read = async (req, res) => {
  try {
    const { slug } = req.params
    const address = await User.find(
      { email: req.user.email },
      { addresses: { slug: slug, location: 1 } }
    ).exec()
    res.json(address)
  } catch (error) {
    console.log('GET ADDRESS FAILED IN BE -->', error)
  }
}

exports.update = async (req, res) => {
  console.log(req.body)
  const { name } = req.body
  try {
    const updated = await User.findOneAndUpdate(
      { email: req.user.email },
      // { slug: req.params.slug },
      { addresses: { location: name, slug: slugify(name) } },
      { new: true }
    )
    console.log(updated)
    res.json(updated)
  } catch (error) {
    console.log('UPDATE COLOR FAILED IN BE -->', error)
  }
}