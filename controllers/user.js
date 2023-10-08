const User = require('../model/user')
const Product = require('../model/product')
const Cart = require('../model/cart')
const Coupon = require('../model/coupon')
const Order = require('../model/order')
const getUid = require('get-uid')

exports.userCart = async (req, res) => {
  const { cart } = req.body
  let products = []
  // Find user in db
  const user = await User.findOne({ email: req.user.email }).exec()
  // Check if user already has a cart in db
  let existingCart = await Cart.findOne({ orderedBy: user._id }).exec()
  // Reset the cart content
  if (existingCart) existingCart.remove()
  // Create an object with all needed properties
  for (let index = 0; index < cart.length; index++) {
    const object = {}
    // Get id, count and color from fe and assign to object
    object.product = cart[index]._id
    object.count = cart[index].count
    object.color = cart[index].color
    // Get price from db and assign to object
    let { price } = await Product.findById(cart[index]._id)
      .select('price')
      .exec()
    object.price = price
    // Push object to products array
    products.push(object)
  }
  // Find the total price of the cart
  let cartTotal = 0
  for (let index = 0; index < products.length; index++) {
    cartTotal = cartTotal + products[index].price * products[index].count
  }
  // Create the new cart with all info
  const newCart = await new Cart({
    products: products,
    cartTotal: cartTotal,
    orderedBy: user._id,
  }).save()
  // Send the ok to fe
  res.json({ ok: true })
}

exports.getUserCart = async (req, res) => {
  // Find user in db based on email form fe
  const user = await User.findOne({ email: req.user.email }).exec()
  // Find user's cart and populate the products
  const cart = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price totalAfterDiscount')
    .exec()
  // Destructure what we need in fe from cart
  const { products, cartTotal, totalAfterDiscount } = cart
  // Send response to fe
  if (!cart) return
  res.json({ products, cartTotal, totalAfterDiscount })
}

// Empty user cart
exports.emptyCart = async (req, res) => {
  // Find user in db based on email form fe
  const user = await User.findOne({ email: req.user.email }).exec()
  // Find user's cart in db and remove it
  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec()
  // Send confirmation to fe
  res.json(cart)
}

// // Update user's address
// exports.saveAddress = async (req, res) => {
//   // Find user in db based on email form fe and udpate the address with what we receive from fe
//   const userAddress = await User.findOneAndUpdate(
//     { email: req.user.email },
//     { address: req.body.address }
//   ).exec()
//   // Send confirmation to fe
//   res.json({ ok: true })
// }

// Coupon functionality
exports.applyCouponToUserCart = async (req, res) => {
  // Get coupon name from fe body
  const { coupon } = req.body
  // If coupon is not valid, get null, otherwise, get the coupon
  const validCoupon = await Coupon.findOne({ name: coupon }).exec()
  // Send error to fe for invalid coupon
  if (validCoupon === null) return res.json({ err: 'Invalid coupon' })
  // Find the user in db
  const user = await User.findOne({ email: req.user.email }).exec()
  // Get user's cart total and cart products from db
  const { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate('products.product', '_id title price')
    .exec()
  // Calculate the cart total after applying the discount
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2)
  // Add the total after discount value to the cart in db
  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount: totalAfterDiscount },
    { new: true }
  ).exec()
  // Send new cart total to fe
  res.json(totalAfterDiscount)
}

// Create card payment order in db
exports.createOrder = async (req, res) => {
  // Get payment info from fe
  const { paymentIntent } = req.body.stripeResponse
  // Find user in db using email from fe
  const user = await User.findOne({ email: req.user.email }).exec()
  // Get products from user's cart in db
  const { products } = await Cart.findOne({ orderedBy: user._id }).exec()
  // Create new order entry in db
  const newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save()
  // Decrement stock, increment sold
  const bulkOption = products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }
  })
  const updated = await Product.bulkWrite(bulkOption, {})
  // Send ok to fe
  res.json({ ok: true })
}

// Create cash on delivery order in db
exports.createCashOrder = async (req, res) => {
  //
  const { couponApplied } = req.body
  // Find user in db using email from fe
  const user = await User.findOne({ email: req.user.email }).exec()
  // Get user's cart from db
  const userCart = await Cart.findOne({ orderedBy: user._id }).exec()
  //
  const finalAmount =
    couponApplied && userCart.totalAfterDiscount
      ? userCart.totalAfterDiscount * 100
      : userCart.cartTotal * 100
  // Create new order entry in db
  const newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: getUid(),
      amount: finalAmount,
      currency: 'usd',
      status: 'on delivery',
      created: Date.now(),
      payment_method_types: ['cash'],
    },
    orderedBy: user._id,
  }).save()
  // Decrement stock, increment sold
  const bulkOption = userCart.products.map(item => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    }
  })
  const updated = await Product.bulkWrite(bulkOption, {})
  // Send ok to fe
  res.json({ ok: true })
}

// Send orders to fe for user's history
exports.getOrders = async (req, res) => {
  // Find user in db using email from fe
  const user = await User.findOne({ email: req.user.email }).exec()
  // Find user's orders based on email and populate products array with each product
  const userOrders = await Order.find({ orderedBy: user._id })
    .populate('products.product')
    .exec()
  // Send order's list to fe
  res.json(userOrders)
}

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  // Get the product id from fe
  const { productId } = req.body
  // Find user in db using email from fe and add the product to his wishlist ($addToSet makes sure there are no duplicates)
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).exec()
  // Send confirmation response to fe
  res.json({ ok: true })
}

// Get wishlist
exports.wishlist = async (req, res) => {
  // Find the user based on email from fe, select only the wishlist from his db entry and populate
  const list = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist')
    .exec()
  // Send the list in response to fe
  res.json(list)
}

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  // Get the product id from url
  const { productId } = req.params
  // Find the user in db based on email and pull the product from wishlist based on product id
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec()
  // Send confirmation to fe
  res.json({ ok: true })
}
