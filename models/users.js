const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose .Schema({
    name: {
        type: String,
        required: [true, 'name must be filled']
    },
    email: {
        type: String,
        required: [true, 'email must be filled'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'provide a password']
    },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    }
})

userSchema.pre('save', async function(next) {
    try {
        if(!this.isModified('password')) {
            return next()
        }
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword;
        return next()
    } catch (error) {
        next(error)
    }
})
// hash the plain text password before saving to database
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        return error;
    }
}

const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

function validatePassword(password, confirmPassword) {
    // check for minimum length of six characters and at least one uppercase letter, lowercase letter, digit
    if(password.length <6) {
    return 'Password is too short. It must be at least 6 characters long.';
}
if(!password.match(passwordValidator)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol (@$!%*#?&).';
}
if(password !== confirmPassword) {
    return 'The Password does not match, please try again'
}
return 'Password is strong'

}

module.exports = {
  User: mongoose.model('User', userSchema),
  validatePassword
};