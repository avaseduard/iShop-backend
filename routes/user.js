const express = require('express')
const router = express.Router()

// Middlewares - check the token and check for admin role
const { authCheck } = require('../middlewares/auth')

// Import controllers which we use below as arguments in router actions
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  createCashOrder,
  getOrders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
} = require('../controllers/user')

// Routes (endpoints)
router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, emptyCart)
router.post('/user/address', authCheck, saveAddress)
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart)
router.post('/user/order', authCheck, createOrder)
router.post('/user/cash-order', authCheck, createCashOrder)
router.get('/user/orders', authCheck, getOrders)
router.post('/user/wishlist', authCheck, addToWishlist)
router.get('/user/wishlist', authCheck, wishlist)
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist)

module.exports = router
