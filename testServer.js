const express = require('express')
const connectDB = require('./config/testDB')

const app = express()

connectDB()
app.use(express.json({extended: false}))
app.use('/api/categories', require('./routes/api/categories'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use(function(req,res){
    res.status(404).send("Page not found");
});

module.exports = app

