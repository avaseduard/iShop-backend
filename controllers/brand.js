const Brand = require('../model/brand')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    const { name } = req.body
    const brand = await new Brand({
      name: name,
      slug: slugify(name),
    }).save()
    res.json(brand)
  } catch (error) {
    console.log('BRAND CREATE FAILED IN BE -->', error)
  }
}

exports.list = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ createdAt: -1 }).exec()
    res.json(brands)
  } catch (error) {
    console.log('BRAND LIST FAILED IN BE -->', error)
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Brand.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (error) {
    console.log('BRAND REMOVE FAILED IN BE -->', error)
  }
}

exports.read = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug }).exec()
    res.json(brand)
  } catch (error) {
    console.log('GET ONE BRAND FAILED IN BE -->', error)
  }
}

exports.update = async (req, res) => {
  const { name } = req.body
  try {
    const updated = await Brand.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, slug: slugify(name) },
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    console.log('UPDATE BRAND FAILED IN BE -->', error)
  }
}
