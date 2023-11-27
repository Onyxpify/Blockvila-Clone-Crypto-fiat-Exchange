const Coin = require('../../models/coins')
const Order = require('../../models/orders')
const { isClient } = require('../../middlewares/client-auth')

const createOrder = async (req, res) => {
    try {
        // Check if the user is authenticated and has the Client role
        if(!isClient(req.user)) {
           return res.status(403).json({error: "Unauthorized"})
        }
        const {
            coinName,
            amountInUsd,
            address,
            type,
            status,
            bankName,
            accountName,
            accountNumber,
            accountType
        } = req.body
        // Validate required fields
        if(!coinName 
            || !amountInUsd 
            || !address 
            || !type 
            || !status 
            || !bankName 
            || !accountName 
            || !accountNumber 
            || !accountType){
            return res.status(400).json({error: "All fields are required"})
        }
        // Check if the coin with the given coinName exists
        const existingCoin = await Coin.findOne({name: coinName})
        if(!existingCoin){
            return res.status(400).json({ error:"Coin not found"})
        }
       
        //get the user Id
        const userId = req.user._id;

        // Calculate the equivalent amount in NGN using the buy rate from admin
        const equivalentAmountNGN = amountInUsd * existingCoin.buy

        // Create a new order
        const newOrder = new Order({
            user: userId,
            coinName,
            type,
            amountInUsd,
            equivalentAmountNGN,
            address,
            status,
            bankName,
            accountName,
            accountNumber,
            accountType
        })
        
        await newOrder.save()
        res.status(200).json(newOrder)
    } catch (error) {
        res.status(500).json({error: 'server error'})
    }
}

//UPDATE ORDERS

const updateOrder = async (req, res) => {
    try {
        // Check if the user is authenticated and has the Client role
        if(!isClient(req.user)) {
            return res.status(401).json({error: "Unauthorized"})
        }
       
        const {orderId} = req.params;
        const order = await Order.findById(orderId)

        if(!order){
            return res.status(403).json({error: "order not found"})
        }

        // Ensure the order belongs to the authenticated user
        if(String(order.user) !== String(req.user._id)) {
            return res.status(403).json({error: "you can only update your own order"})
        }

        // Update the order with the new data from req.body
        for(let key in req.body) {
            order[key] = req.body[key]
        }
        await order.save()
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({error: 'server error'})
    }
}
// Update order status to closed or approved for admins
const updateOrderStatus = async (req, res) => {
    try {
        // Check if the user is authenticated and has the Client role
        if(!isClient(req.user)) {
            return res.status(401).json({error: "Unauthorized"})
        }

        const {orderId} = req.params;
        const {status} = req.body

         // Check if the order belongs to the authenticated user
         const order = await Order.findOne({_id: orderId, user: req.user._id})
         if(!order) {
            return res.status(404).json({error: "order not found"})
         }
         
         if (order.status ==="pending"){
            order.status = "paid";
            await order.save()
            res.status(200).json(order)
         } else {
            return res.status(400).json({ error: 'Invalid status update' });
         }
    } catch (error) {
        return res.status(400).json({ error: 'server error' });
    }
}


//delete orders

const deleteOrder = async (req, res) => {
    try {
        // Check if the user is authenticated and has the Client role
if(!isClient(req.user)) {
    return res.status(401).send("You are unauthorized")
}
const {orderId} = req.params;
const order = await Order.findById(orderId)

if(!order){
    return res.status(403).json({error:"order doesnot exist"})
}
// Ensure the order belongs to the authenticated user
if(String(order.user) !== String(req.user._id)) {
    return res.status(403).json({error:'only owner of this order can delete it'})
}
//delete the order
await order.remove();
res.status(200).json('deleted')
    } catch (error) {
        res.status(500).json({error: "server error"})
    }
}

// get all orders
const getAllOrders = async (req, res) => {
    try {
        // Check if the user is authenticated and has the Client role
        if(!isClient(req.user)) {
            return res.status(401).json({error: "Unauthorized"})
        }

          // Get orders only for the authenticated client
          const userId = req.user._id;
          const orders = await Order.find({user: userId})
       
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({error: 'server error'})
    }
}
const getOrderById = async (req, res) => {
    try {
         // Check if the user is authenticated and has the Client role
         if(!isClient(req.user)) {
            return res.status(401).json({error: "Unauthorized"})
         }
            const {orderId} = req.params;

            // Find the order by ID and ensure it belongs to the authenticated client
            const order =  await Order.findOne({_id: orderId , user: req.user._id});
         
            if (!order){
                return res.status(404).json({error: "Order not found"})
            }
            res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}
module.exports = {
    createOrder,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrderById
}

//admin get all orders, get all pending, paid, completed, closed. also admin need to delete order by id
//also how can admin mark order as pending, paid, completed, closed