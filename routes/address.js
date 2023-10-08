const express = require('express')
const router = express.Router()

const { authCheck } = require('../middlewares/auth')

const { create, list, remove, read, update } = require('../controllers/address')

router.post('/address', authCheck, create)
router.get('/addresses', authCheck, list)
router.get('/address/:slug', authCheck, read)
router.put('/address/:slug', authCheck, update)
router.delete('/address/:slug', authCheck, remove)

module.exports = router
