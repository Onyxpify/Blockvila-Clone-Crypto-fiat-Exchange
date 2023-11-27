const Coins = require('../../models/coins')


// Function to get all coins
const getAllCoins = async (req, res) => {
    try {
        const coin = await Coins.find();
        res.status(200).json(coin)
    } catch (error) {
        console.log(error)
        res.status(404).json({error: "error fetching coin"})
    }
}

// Function to create a new coin
const createCoin = async (req, res) => {
    try {
        const {name, symbol, logo, buy, sell} = req.body

        // Validate required fields
        if (!name || !symbol || !buy || !sell) {
            return res.status(400).json({error: "all fields are required"})
        }
         // Check if the coin with the given name already exists
         const existingCoin = await Coins.findOne({name})
        if(existingCoin){
           return res.status(409).json({error: "Coin with this name already exists"})
        }
        // create new coin if not existing
        const createdCoin = new Coins({name, symbol, logo, buy, sell})
        await createdCoin.save()
        res.status(200).json(createdCoin)
    } catch (error) {
        res.status(500).json({error: 'server error'})
    }
    }

    // Function to update a coin by name
const updateCoin = async (req, res) => {
    try {
    
        const {_id, name, symbol, logo, buy, sell} = req.body

        // Validate required fields
        if (!name || !symbol || !buy || !sell) {
            return res.status(404).json({error: "all fields are required"})
        }

        const updatedCoin = await Coins.findOneAndUpdate(
            {name},
            {name, symbol, logo, buy, sell},
            {new: true}
        )
        // if the coin is not found
        if(!updatedCoin){
            return res.status(404).json({error: 'Coin not found'})
        }
        res.status(200).json(updatedCoin)
    } catch (error) {
        res.status(500).json({error: 'server error'})
}

}

// Function to delete a coin by name
const deleteCoin = async (req, res) => {
    try {
        const {name} = req.body

        // Validate required field
        if(!name) {
            return res.status(404).json({error: 'coin name is required'})
        }
        // Find and remove the coin by name
        const deletedCoin = await Coins.findOneAndDelete({name})

        if(!deletedCoin) {
            return res.status(404).json({error: 'Coin not found'})
        }
        res.status(200).json({message: 'coin deleted successfully'})
    } catch (error) {
        res.status(500).json({error: 'server error'})
    }
}

module.exports = {
    getAllCoins,
    createCoin,
    updateCoin,
    deleteCoin
}