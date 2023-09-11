const Cart = require('../model/cart')
const Coupon = require('../model/coupon')
const Product = require('../model/product')
const User = require('../model/user')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.createPaymentIntent = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec()

  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  }).exec()

  const { couponApplied } = req.body

  const finalAmount =
    couponApplied && totalAfterDiscount
      ? totalAfterDiscount * 100
      : cartTotal * 100

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: 'usd',
  })

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  })
}
