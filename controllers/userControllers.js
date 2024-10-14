const expressAsyncHandler = require("express-async-handler")
const { createCustomError } = require('../errors/customError')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// @desc Register a User
// @route POST /api/users/register
// @access PUBLIC
const register = expressAsyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return next(createCustomError('All fields are mandatory!', 400))
    }

    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        return next(createCustomError('User already Registered', 400))
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })
    if (user) {
        return res.status(201).json({ _id: user.id, email: user.email })
    }
    else {
        return next(createCustomError('User data is not valid', 400))
    }
    // res.status(200).json({ message: "User Registerd!"})
})

// @desc Login User
// @route POST /api/users/login
// @access PUBLIC
const login = expressAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(createCustomError('All fields are mandatory!', 400))
    }
    const user = await User.findOne({ email })
    if (user && await bcrypt.compare(password, user.password)) {
        const accessToken = await jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        }, process.env.JWT_TOKEN_SECRET_KEY, {
            expiresIn: '30m'
        })
        return res.status(200).json({ accessToken })
    }
    else {
        return next(createCustomError('Please enter valid email or password', 401))
    }
})

// @desc Get Current User Info.
// @route GET /api/users/current
// @access PRIVATE
const current = expressAsyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

module.exports = { register, login, current }