const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require("mongoose").default
const AuthRoute = require('./routes/AuthRoute.js')
const UserRoute = require('./routes/UserRoute.js')
const PostRoute = require('./routes/PostRoute.js')
const UploadRoute = require('./routes/UploadRoute.js')
const ChatRoute = require('./routes/ChatRoute.js')
const MessageRoute = require('./routes/MessageRoute.js')
const CommentRoute = require('./routes/CommentRoute.js')
const SchemeRoute = require('./routes/SchemeRoutes.js')
require('dotenv').config()

console.log(`converted to es5`)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', express.static(__dirname + '/build'))
app.use('*', express.static(__dirname + '/build'))


app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
app.use('/comments', CommentRoute)
app.use('/schemes', SchemeRoute)


const PORT = process.env.PORT
const CONNECTION = process.env.MONGODB_CONNECTION
mongoose
    .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const port = process.env.PORT
        app.listen(port || 5000)
        console.log(`Server running on port: ${port || 5000}`)
        console.log(`Listening @ Port ${PORT} | Mongoose is successfully connected`)
    })
    .catch((error) => console.log(`${error} Mongodb did not connect`));



