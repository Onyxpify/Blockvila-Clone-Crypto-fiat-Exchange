const express = require('express');
const router = express.Router()
const {User, validatePassword }= require('../models/users')
const authenticate = require('../middlewares/authenticate');
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const jwtSecret = require('../middlewares/authenticate').jwtSecret;


// Validation middleware
const registrationValidator = [
    check('name').notEmpty().withMessage('Name must not be empty'),
    check('email').isEmail().withMessage('Invalid Email format'),
    check('password').isLength({min : 6}).withMessage('Password must be at least least 6 characters'),
    check('confirmPassword').custom((value, {req}) => {
        if( value !== req.body.password) {
            throw new Error("Confirm password does not match")
    }
    return true
}),
check('role').isIn(['admin', 'client']).withMessage('Invalid role')
]

router.post('/register', registrationValidator, async (req, res, next) =>{
    try {
        console.log("Request received at /register");
        const {name, email, password, confirmPassword, role} = req.body
        console.log("Received password:", password);
        console.log("Received confirmPassword:", confirmPassword);
          // Validate password
          const passwordValidationResult = validatePassword(password, confirmPassword);
          console.log("Password validation result:", passwordValidationResult);
          if (passwordValidationResult !== 'Password is strong') {
              return res.status(400).json({ message: passwordValidationResult });
          }
      
        // Validation logic
      const errors = validationResult(req)

      // Check if there are validation errors
      if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() })
    }
        // Validate role
        if(role !== 'admin' && role !== 'client'){
            return res.status(403).json({message:'invalid role'})
        }
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(409).json({message: "email already exist"})
        }
        // Create a new user and save it to the database
        const newUser = await User.create({name, email, password, role});
        console.log("After creating a new user");
        const token = jwt.sign({userId: newUser._id}, jwtSecret, {expiresIn: '1h'})
        console.log("Sending response")

        return res.status(201).json({message: "User created successfully", newUser})
    } catch (error) {
        console.log("Error in /register route:", error);
        return next(error)
    }
})

router.post('/client/login', async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user || user.role !== 'client'){
            return res.status(401).json({message: "Invalid email or password"});
        }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"})
        }

        req.session.userId = user.id;
        const token = jwt.sign({userId: user._id}, jwtSecret, {expiresIn: "1h"})

         // Sending the token in the response body as JSON
        return res.status(200).json({
         message: "Login successful",
        token: `Bearer ${token}`, 
        });

        return res.status(200).json({message: "Login successful"})
    } catch (error) {
        console.log(error)
        return next(error)
    }
})
router.post('/admin/login', async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user || user.role !== 'admin'){
            return res.status(401).json({message: "Invalid email or password"});
        }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"})
        }

        req.session.userId = user.id;
        const token = jwt.sign({userId: user._id}, jwtSecret, {expiresIn: "1h"})

         // Sending the token in the response body as JSON
        return res.status(200).json({
         message: "Login successful",
        token: `Bearer ${token}`, 
        });

        return res.status(200).json({message: "Login successful"})
    } catch (error) {
        console.log(error)
        return next(error)
    }
})
router.get('/logout', (req, res, next) => {
    try {
        req.session.destroy();
        return res.status(200).json({message: 'logout successful'})
    } catch (error) {
        console.log(error)
        return next(error)
    }
})

module.exports = router