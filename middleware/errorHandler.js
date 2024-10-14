const { customError } = require("../errors/customError");
const { constants } = require('../constants')

const errorHandler = async (err, req, res, next) => {
    if (err instanceof customError) {
        switch (err.statusCode) {
            case constants.VALIDATION_ERROR:
                res.status(err.statusCode).json({ title: 'Validation Error', message: err.message, stack: err.stack })
                break;

            case constants.UNAUTHORIZED:
                res.status(err.statusCode).json({ title: 'Unauthorized', message: err.message, stack: err.stack })
                break;
            case constants.FORBIDDEN:
                res.status(err.statusCode).json({ title: 'Forbidden', message: err.message, stack: err.stack })
                break;
            case constants.NOT_FOUND:
                res.status(err.statusCode).json({ title: 'Not Found', message: err.message, stack: err.stack })
                break;
            case constants.SERVER_ERROR:
                res.status(err.statusCode).json( { title: 'Server Error', message: err.message, stack: err.stack})
                break;
            default:
                console.log('default case means all good!')
                break;
        }
        // res.status(err.statusCode).json({message: err.message})
    }
    else {
        console.log("Error in else block of errorHandler file", err)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

module.exports = errorHandler