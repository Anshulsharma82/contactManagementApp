const express = require('express')
const { register, login, current } = require('../controllers/userControllers')
const router = express.Router()
const validateToken = require('../middleware/validateJWTHandler')

router.post('/register', register)
router.post('/login', login)
router.route('/current').get(validateToken, current)

module.exports = router