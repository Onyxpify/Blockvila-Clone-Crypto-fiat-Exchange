const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function authenticate (req, res, next) {
    // Get token from header
    const token = req.headers.authorization || req.cookies.token || "";

    //check if not empty or token is valid
    if(!token) {
        return res.status(401).json({error: "no token provided"})
    }

    // Check if the token is valid
        jwt.verify(token, jwtSecret, (err, user) => {
            if(err) {
                return res.status(401).json({error: "Unauthorized"})
            }

             // Attach the user object to the request for later use in route handlers
             req.user = user
             console.log('Authenticated user:', req.user);
             next()
        })
    
}
module.exports= {
    jwtSecret,
    authenticate
}