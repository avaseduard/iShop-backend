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
} = require('../controllers/subcategory')

// Routes (endpoints)
router.post('/subcategory', authCheck, adminCheck, create)
router.get('/subcategories', list)
router.get('/subcategory/:slug', read)
router.put('/subcategory/:slug', authCheck, adminCheck, update)
router.delete('/subcategory/:slug', authCheck, adminCheck, remove)

module.exports = router
