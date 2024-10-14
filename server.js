const express = require('express')
require('dotenv').config()
const contactRoutes = require('./routes/contactRoutes')
const errorHandler = require('./middleware/errorHandler')
const connectDB = require('./config/dbConnection')
const userRoutes = require('./routes/userRoutes')

connectDB()
const PORT = process.env.PORT || 5000
const app = express()
app.use(express.json())
app.use('/api/contacts', contactRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})
