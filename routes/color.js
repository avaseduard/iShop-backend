const express = require('express')
const router = express.Router()

const { authCheck, adminCheck } = require('../middlewares/auth')

const { create, list, remove, read, update } = require('../controllers/color')

router.post('/color', authCheck, adminCheck, create)
router.get('/colors', list)
router.get('/color/:slug', read)
router.put('/color/:slug',authCheck, adminCheck, update)
router.delete('/color/:slug', authCheck, adminCheck, remove)

module.exports = router
