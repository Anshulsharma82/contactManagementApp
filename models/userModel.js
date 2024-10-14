const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter the username']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter the password']
    }
}, {timestamps: true })

const userModel = mongoose.model('User', userSchema)

module.exports = userModel