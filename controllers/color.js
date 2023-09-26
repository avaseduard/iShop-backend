const Color = require('../model/color')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    const { name } = req.body
    const color = await new Color({
      name: name,
      slug: slugify(name),
    }).save()
    res.json(color)
  } catch (error) {
    console.log('COLOR CREATE FAILED IN BE -->', error)
  }
}

exports.list = async (req, res) => {
  try {
    const colors = await Color.find({}).sort({ createdAt: -1 }).exec()
    res.json(colors)
  } catch (error) {
    console.log('COLOR LIST FAILED IN BE -->', error)
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Color.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (error) {
    console.log('COLOR REMOVE FAILED IN BE -->', error)
  }
}

exports.read = async (req, res) => {
  try {
    const color = await Color.findOne({ slug: req.params.slug }).exec()
    res.json(color)
  } catch (error) {
    console.log('GET ONE COLOR FAILED IN BE -->', error)
  }
}

exports.update = async (req, res) => {
  const { name } = req.body
  try {
    const updated = await Color.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, slug: slugify(name) },
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    console.log('UPDATE COLOR FAILED IN BE -->', error)
  }
}
