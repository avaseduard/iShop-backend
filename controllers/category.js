const Category = require('../model/category')
const Product = require('../model/product')
const Subcategory = require('../model/subcategory')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    // Get the category name from frontend
    const { name } = req.body
    // Create the new category in db using the model
    const category = await new Category({
      name: name,
      slug: slugify(name),
    }).save()
    // Send the response
    res.json(category)
  } catch (error) {
    // console.log(error)
    res.status(400).send('Create category failed')
  }
}

// Find all created categories and sort them by newest to latest
exports.list = async (req, res) =>
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec())

// Find one category by slug name, which we get form params (the last part of the endpoint '/category/:slug'); find all products in that category based on _id
exports.read = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec()
  const products = await Product.find({ category: category })
    .populate('category')
    .exec()
  res.json({
    category: category,
    products: products,
  })
}

exports.update = async (req, res) => {
  const { name } = req.body
  try {
    // Get the category name from frontend
    // Find the category in db by slug and update the name and slug with the one we get from front end (new: true sends the category after updating)
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name: name, slug: slugify(name) },
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    // console.log(error)
    req.status(400).send('Update category failed')
  }
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (error) {
    // console.log(error)
    req.status(400).send('Delete category failed')
  }
}

exports.getSubcategories = (req, res) => {
  Subcategory.find({ parent: req.params._id }).exec((error, subcategories) => {
    if (error) console.log(error)
    res.json(subcategories)
  })
}
