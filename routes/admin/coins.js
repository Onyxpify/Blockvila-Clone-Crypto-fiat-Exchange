const express = require('express')
const router = express.Router()
const session = require('express-session')
const isAdmin = require('../../middlewares/admin-auth')
const coins = require("../../controllers/admin/coins")
const {authenticate} = require("../../middlewares/authenticate")

router.use(authenticate);
router.use(isAdmin)

// Public route accessible to all users
router.get('/coins', coins.getAllCoins)

// Protected routes accessible only to admin users
router.post('/coins/create', coins.createCoin)
router.put('/coins/update/:coinId', coins.updateCoin)
router.delete('/coins/delete/:coinId', coins.deleteCoin)

module.exports = router;