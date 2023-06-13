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
const { createServer } = require('http')
const { Server } = require('socket.io')
const { MongoClient } = require('mongodb')
const path = require('path')
require('dotenv').config()



const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } });




app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/build'))

app.get("/", function (req, res) {
    return res.sendFile(path.join(__dirname, "build", "index.html"))
})


app.use('/auth', AuthRoute)
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
        httpServer.listen(port || 5000)
        console.log(`Server running on port: ${port || 5000}`)
        console.log(`Listening @ Port ${PORT} | Mongoose is successfully connected`)
    })
    .catch((error) => console.log(`${error} Mongodb did not connect`));






// mongodb events 

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
}

async function monitorListingsUsingEventEmitter(client, timeInMs = 60000, pipeline = []) {
    const collection = client.db("test").collection("messages");

    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
    const changeStream = collection.watch(pipeline);

    // ChangeStream inherits from the Node Built-in Class EventEmitter (https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).
    // We can use EventEmitter's on() to add a listener function that will be called whenever a change occurs in the change stream.
    // See https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_emitter_on_eventname_listener for the on() docs.
    changeStream.on('change', (data) => {
        console.log(`changes detected in mongodb: ${JSON.stringify(data)}`)
        io.emit('message', data)
    })

    console.log(`listings : waiting for changes in mongodb`);

    // Wait the given amount of time and then close the change stream
    await closeChangeStream(timeInMs, changeStream);
}


async function mongooseEvents() {

    let uri = process.env.MONGODB_CONNECTION
    let client = new MongoClient(uri);

    try {
        await client.connect();
        const pipeline = [
            {
                '$match': {
                    'operationType': 'insert'
                }
            }
        ]

        await monitorListingsUsingEventEmitter(client, 60000 * 30, pipeline)

    } finally {
        await client.close();
    }
}


// socket events


io.on('connection', (socket) => {
    console.log(`on connection : server connected to soket.io : ${socket.id} `)
    socket.on('listen', async (data) => {
        if (data && Object.keys(data).length) {
            console.log(`LISTEN_EVEN :: Activate a listener for : ${JSON.stringify(data)}`)
            await mongooseEvents()
        }
    })
})






