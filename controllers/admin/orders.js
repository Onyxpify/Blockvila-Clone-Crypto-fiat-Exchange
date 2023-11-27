const Order = require("../../models/orders")
const isAdmin = require("../../middlewares/admin-Auth")

//Update the order
const updateOrder = async (req, res) => {

 try {
    const {orderId} = req.params;
    const {status} =req.body

    // Find the order
    const order = await Order.findById(orderId);
    if(!order){
        return res.status(404).json({error: "order not found"})
    }

    // Update the order status
    order.status = status
    await order.save()

    return res.status(200).json({message: "order updated successfully"})
} catch (error) {
    console.log("error updating status", error)
    return  res.status(500).json({message: "internal error"})
}
}

const getAllOrders = async (req, res) => {
    try {
       // Query the database to retrieve all orders
       const orders = await Order.find()
       .sort({createdAt: -1})// Sort by creation date in descending order (newest to oldest)
       .exec ()

       return res.status(200).json({orders})

    } catch (error) {
        console.log("Error fetching orders", error)
        return res.status(500).json({error: "internal server error"})
    }
}

const deleteOrder = async (req, res) => {
    try {
        const {orderId } = req.params
        const order = await Order.findById (orderId)

        if(!order){
            return res.status(404).json({error: "order not found"})
        }

    } catch (error) {
        
    }
}
module.exports = {
    updateOrder,
    getAllOrders,
    deleteOrder
}


//admin need to find all orders in order of date 
//delete orders
//get orders by order id
//i need to create a JWTtoken
//i need to create admin user