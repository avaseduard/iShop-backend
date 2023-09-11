const Product = require('../model/product')
const User = require('../model/user')
const slugify = require('slugify')

exports.create = async (req, res) => {
  try {
    // Set the slub to req body, by slugifying the title (the slug is not coming from front end)
    req.body.slug = slugify(req.body.title)
    // Save the new product in database
    const newProduct = await new Product(req.body).save()
    // Send the response
    res.json(newProduct)
  } catch (error) {
    console.log('PRODUCT UPDATE FAILED -->', error)
    res.status(400).json({
      error: error.message,
    })
  }
}

// Find all created products and sort them by newest to latest
exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subcategories')
    .sort([['createdAt', 'desc']])
    .exec()
  res.json(products)
}

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      slug: req.params.slug,
    }).exec()
    res.json(deleted)
  } catch (error) {
    console.log('PRODUCT REMOVE FAILED -->', error)
    return res.status(400).send('PRODUCT REMOVE FAILED')
  }
}

exports.read = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
  })
    .populate('category')
    .populate('subcategories')
    .exec()
  res.json(product)
}

exports.update = async (req, res) => {
  try {
    // If we have a new title coming from front end, set the slug to req body
    if (req.body.title) req.body.slug = slugify(req.body.title)
    // Update the product in database
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug }, // query db by slug
      req.body, // update with what we get from front end body
      { new: true } // return updated version of product from db
    ).exec()
    // Send the response with updated product
    res.json(updated)
  } catch (error) {
    console.log('PRODUCT UPDATE FAILED -->', error)
    res.status(400).json({
      error: error.message,
    })
  }
}

// To list new arrivals and best sellers on home page
exports.list = async (req, res) => {
  try {
    // Destructure the sort, order and limit that we receive from front end
    const { sort, order, page } = req.body // {createdAt/ updatedAt, asc/ desc, 3/ 5/ 10}
    const currentPage = page || 1
    const perPage = 3
    // Get products from db based on the page no. from frontend and no. of items per page
    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate('category')
      .populate('subcategories')
      .sort([[sort, order]])
      .limit(perPage)
      .exec()
    // Send found products to front end
    res.json(products)
  } catch (error) {
    console.log('LIST NEW ARRIVALS OR BEST SELLERS FAILED -->', error)
  }
}

// To get the numbers of products from db for pagination
exports.productsCount = async (req, res) => {
  // let total = await Product.find({}).estimatedDocumentCount().exec()
  let total = await Product.count()
  res.json(total)
}

//
exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec()
  const user = await User.findOne({ email: req.user.email }).exec()
  const { star } = req.body
  // Check if the user has already left rating for this product
  const existingObjectRating = product.ratings.find(
    element => element.postedBy.toString() === user._id.toString()
  ) // return either undefined or the rating object
  // If the user hasn't left a rating yet, find the product in db by id and push the rating (with star and user id) to the product's rating db array
  if (existingObjectRating === undefined) {
    const ratingAdded = Product.findByIdAndUpdate(
      product._id,
      {
        $push: {
          ratings: {
            star: star,
            postedBy: user._id,
          },
        },
      },
      { new: true }
    ).exec()
    console.log('RATING ADDED -->', ratingAdded)
    res.json(ratingAdded)
  } else {
    // If the user has already left a rating for the product in db, search the rating object by the existingObjectRating we have from front end and update it with the star we get from front end
    const updatedRating = await Product.updateOne(
      {
        ratings: {
          $elemMatch: existingObjectRating,
        },
      },
      { $set: { 'ratings.$.star': star } },
      { new: true }
    ).exec()
    console.log('RATING UPDATED -->', updatedRating)
    res.json(updatedRating)
  }
}

exports.listRelated = async (req, res) => {
  // Find product based on id sent from front end
  const product = await Product.findById(req.params.productId).exec()
  // Find related products (same category), excluding the above one
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate('category')
    .populate('subcategories')
    .populate('postedBy')
    .exec()

  res.json(related)
}

// Search & filter

// Query the db based on the text property (which is true in the model, for title and description)
const handleQuery = async (req, res, query) => {
  // const products = await Product.find({ $text: { $search: query } })
  const products = await Product.find({
    title: {
      $regex: query,
      $options: 'i',
    },
    description: {
      $regex: query,
      $options: 'i',
    },
  })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('postedBy', '_id name')
    .exec()

  res.json(products)
}

// Query the db based on price array that we get from fe (ie [10, 100])
const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec()

    res.json(products)
  } catch (error) {
    console.log('PRICE FILTER BE ERROR -->', error)
  }
}

const handleCategory = async (req, res, category) => {
  try {
    const products = await Product.find({ category: category })
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec()

    res.json(products)
  } catch (error) {
    console.log('CATEGORY FILTER BE ERROR -->', error)
  }
}

const handleStar = (req, res, stars) => {
  // Create a new doc, based on the Project doc ($$ROOT) and add a new field (floorAverage) which is the average of ratings.star; find the docs that match the stars we get from fe; find the products in our db that matches the aggregates ids
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT',
        floorAverage: {
          $floor: { $avg: '$ratings.star' },
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ]).exec((error, aggregates) => {
    if (error) console.log('AGGREGATE BE ERROR -->', error)
    Product.find({ _id: aggregates })
      .populate('category', '_id name')
      .populate('subcategories', '_id name')
      .populate('postedBy', '_id name')
      .exec((error, products) => {
        if (error) console.log('PRODUCT AGGREGATE BE ERROR -->', error)
        res.json(products)
      })
  })
}

const handleSubcategory = async (req, res, subcategory) => {
  const products = await Product.find({ subcategories: subcategory })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('postedBy', '_id name')
    .exec()
  res.json(products)
}

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping: shipping })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('postedBy', '_id name')
    .exec()
  res.json(products)
}

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color: color })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('postedBy', '_id name')
    .exec()
  res.json(products)
}

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand: brand })
    .populate('category', '_id name')
    .populate('subcategories', '_id name')
    .populate('postedBy', '_id name')
    .exec()
  res.json(products)
}

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, subcategory, shipping, color, brand } = req.body

  if (query) {
    console.log('QUERY FILTER BE -->', query)
    await handleQuery(req, res, query)
  }

  if (price !== undefined) {
    console.log('PRICE FILTER BE -->', price)
    await handlePrice(req, res, price)
  }

  if (category) {
    console.log('CATEGORY FILTER BE -->', category)
    await handleCategory(req, res, category)
  }

  if (stars) {
    console.log('STARS FILTER BE -->', stars)
    await handleStar(req, res, stars)
  }

  if (subcategory) {
    console.log('SUBCATEGORY FILTER BE -->', subcategory)
    await handleSubcategory(req, res, subcategory)
  }

  if (shipping) {
    console.log('SHIPPING FILTER BE -->', shipping)
    await handleShipping(req, res, shipping)
  }

  if (color) {
    console.log('COLOR FILTER BE -->', color)
    await handleColor(req, res, color)
  }

  if (brand) {
    console.log('BRAND FILTER BE -->', brand)
    await handleBrand(req, res, brand)
  }
}
