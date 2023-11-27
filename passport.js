const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/users')



// Configuring the local authentication strategy with a callback function
passport.use('admin', new LocalStrategy((email, password, done) => {
    // Finding the Admin user in the database based on their email
    User.findOne({email}, (err, user) => {
        if (err) {return done(err)}
        if(!user){
            return done(null, false, {message: 'Incorrect email'})
        }
        if(user.role !== 'admin'){
            return done(null, false, {message: 'User is not an admin'})
        }
        if(!user.comparePassword(password)) {
            return done(null, false, {message: "invalid password"})
        }
        return done (null, user)
    })

}))

    passport.use('client', new LocalStrategy((email, password, done) => {
        // Finding the Admin user in the database based on their email
        User.findOne({email}, (err, user) => {
            if (err) {
                return done(err)
            }
            if(!user) {
                return done (null, false, {message: 'incorrect email'})
            }
            if(user.role !== 'client') {
                return done(null, false, {message: 'User is not a client'})
            }
            if(!user.comparePassword(password)) {
                return done(null, false, {message: 'invalid password'})
            }
            return done (null, user)
        })
    }))

    // Serializing the user object to be stored in the session
    passport.serializeUser ((user, done) => {
        done (null, `${user.role}:${user.id}`)
    })

    // Deserializing the user object from the session
    passport.deserializeUser((id, done) => {
        // Deserialize the user based on the user type (admin or client)
        const [UserType, userId] = id.split(':')

        User.findById(userId, (err, user) => {
            if (err) {
                return done (err)
            }
            done (null, user)
        })
    })


    module.exports = passport