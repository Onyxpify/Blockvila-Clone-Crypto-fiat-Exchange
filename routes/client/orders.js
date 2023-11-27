const express = require('express')
const router = express.Router()
const session = require('express-session')
const Order = require('../../models/orders');
const clientOrder = require("../../controllers/client/orders")
const {authenticate} = require("../../middlewares/authenticate")

router.use(authenticate)
// Update order status from pending to paid for clients
router.put('/orders/:orderId/update-status', clientOrder.updateOrderStatus)
router.get ('/orders/', clientOrder.getAllOrders)
router.get ('/orders/:orderId', clientOrder.getOrderById)
router.put ('/orders/:orderId/updateorder', clientOrder.updateOrder)
router.delete ('/orders/:orderId', clientOrder.deleteOrder)
router.post ('/orders/', clientOrder.createOrder)

module.exports = router