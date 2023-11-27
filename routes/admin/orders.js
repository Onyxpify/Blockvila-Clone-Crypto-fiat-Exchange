const express = require('express')
const router = express.Router()
const session = require('express-session')
const isAdmin = require('../../middlewares/admin-Auth')
const adminOrder = require('../../controllers/admin/orders');

router.use(isAdmin)
// Update order status to closed or approved for admins
router.put('/orders/:orderId/updatestatus', adminOrder.updateOrder) 
router.get('/orders', adminOrder.getAllOrders)
router.delete('/orders/:orderId/', adminOrder.deleteOrder) 

module.exports = router