

// es5


const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
// const router = require('./api/router.js')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use('/api', router)
app.use('/', express.static(__dirname + '/build'))

const port = process.env.PORT
app.listen(port || 5000)
console.log(`Server running on port: ${port || 5000}`)



// es6


