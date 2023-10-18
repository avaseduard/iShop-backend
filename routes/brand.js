const express = require('express')
const router = express.Router()

const { authCheck, adminCheck } = require('../middlewares/auth')

const { create, list, remove, read, update } = require('../controllers/brand')

router.post('/brand', authCheck, adminCheck, create)
router.get('/brands', list)
router.get('/brand/:slug', read)
router.put('/brand/:slug',authCheck, adminCheck, update)
router.delete('/brand/:slug', authCheck, adminCheck, remove)

module.exports = router
