const express = require('express')
const router = express.Router()

// Middlewares - check the token and check for admin role
const { authCheck, adminCheck } = require('../middlewares/auth')

// Import controllers which we use below as arguments in router actions
const { addImage, getAllImages, removeImage } = require('../controllers/carousel')

// Routes (endpoints)
router.post('/carousel-image', authCheck, adminCheck, addImage)
router.get('/carousel-images', authCheck, adminCheck, getAllImages)
router.post('/remove-carousel-image', authCheck, adminCheck, removeImage)

module.exports = router
