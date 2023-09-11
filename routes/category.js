const express = require('express')
const router = express.Router()

// Middlewares - check the token and check for admin role
const { authCheck, adminCheck } = require('../middlewares/auth')

// Import controllers which we use below as arguments in router actions
const {
  create,
  list,
  read,
  update,
  remove,
  getSubcategories
} = require('../controllers/category')

// Routes (endpoints)
router.post('/category', authCheck, adminCheck, create)
router.get('/categories', list)
router.get('/category/:slug', read)
router.put('/category/:slug', authCheck, adminCheck, update)
router.delete('/category/:slug', authCheck, adminCheck, remove)
router.get('/category/subcategory/:_id', getSubcategories) // get the subcategories to use in product create when the admin selects a category

module.exports = router
