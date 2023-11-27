const mongoose = require('mongoose');

const connectDB = (url) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
    }).then(() => {
        console.log("Successfully connected to DB")
    }).catch((error) => {
        console.log('Error connecting to database:', error)
    })
}

module.exports = connectDB