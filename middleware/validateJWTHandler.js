const expressAsyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const { createCustomError } = require('../errors/customError')

const validateToken = expressAsyncHandler( async (req,res,next) => {
    const accessToken = req?.headers?.authorization
    if(accessToken && accessToken.startsWith("Bearer")) {
        const token = accessToken.split(" ")
        if(!token[1]) {
            return next(createCustomError('User is not authorized', 401))
        }
        await jwt.verify(token[1], process.env.JWT_TOKEN_SECRET_KEY,(err,decoded) => {
            if(err) {
                console.log("Error while verifying JWT", err)
                return next(createCustomError('User is not authorized', 401))
            }
            console.log("decoded>>>>>>>>>>>>>>", decoded)
            req.user = decoded.user
            next()
        })
    }
    else {
        return next(createCustomError('User is not authorized', 401))
    }
})

module.exports = validateToken