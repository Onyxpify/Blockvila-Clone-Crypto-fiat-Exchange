const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require('express-flash');
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./models/db")
const adminCoinsRoute = require("./routes/admin/coins")
const adminOrdersRoute = require("./routes/admin/orders")
const clientOrdersRoute = require("./routes/client/orders")
const usersRoute = require("./routes/users")
const { authenticate } = require("./middlewares/authenticate");

app.use(express.json()) // for parsing JSON request bodies
app.use(express.urlencoded({extended: true})); // for parsing URL-encoded request bodies
app.use(express.static('public'));


app.use(session({
    secret: 'blockvilaclone',
    saveUninitialized: true,
    resave: false
}))


app.use(flash())
app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use("/", usersRoute)
app.use("/client", clientOrdersRoute)
app.use("/admin", adminOrdersRoute)
app.use("/admin", adminCoinsRoute)


const PORT = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()