import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'
import PostRoute from './routes/PostRoute.js'
import UploadRoute from './routes/UploadRoute.js'
import ChatRoute from './routes/ChatRoute.js'
import MessageRoute from './routes/MessageRoute.js'
import CommentRoute from './routes/CommentRoute.js'
import SchemeRoute from './routes/SchemeRoutes.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { MongoClient } from 'mongodb'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } });


// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// to serve images inside public folder
app.use(express.static('public'));
app.use('/images', express.static('images'));



dotenv.config()
const PORT = process.env.PORT
const CONNECTION = process.env.MONGODB_CONNECTION

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    httpServer.listen(PORT)
    console.log(`Listening @ Port ${PORT} | Mongoose is successfully connected`)
  })
  .catch((error) => console.log(`${error} Mongodb did not connect`));





app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
app.use('/comments', CommentRoute)
app.use('/schemes', SchemeRoute)





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




async function monitorStreamKey(client, timeInMs = 60000, pipeline = []) {
  const collection = client.db("test").collection("users")

  // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#watch for the watch() docs
  const changeStream = collection.watch(pipeline);

  // ChangeStream inherits from the Node Built-in Class EventEmitter (https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter).
  // We can use EventEmitter's on() to add a listener function that will be called whenever a change occurs in the change stream.
  // See https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_emitter_on_eventname_listener for the on() docs.
  changeStream.on('change', (data) => {
    console.log(`changes detected in streamKey: ${JSON.stringify(data)}`)
    io.emit('liveCall', data)
  })


  console.log(`key : waiting for changes in mongodb`);

  // Wait the given amount of time and then close the change stream
  await closeChangeStream(timeInMs, changeStream);
}



async function streamKeyEvent() {

  let uri = process.env.MONGODB_CONNECTION
  let client = new MongoClient(uri);

  try {
    await client.connect()

    const pipeline2 = [
      {
        '$match': {
          'operationType': 'update'
        }
      }
    ]

    await monitorStreamKey(client, 60000 * 120, pipeline2)

  } finally {
    await client.close();
  }
}


// socket events



io.on('connection', (socket) => {

  console.log(`on connection : server connected to soket.io `)

  socket.on('disconnect', () => {
    console.log("disconnected")
  })


  socket.on('listen', async (data) => {
    if (data && Object.keys(data).length) {
      console.log(`LISTEN_EVEN :: Activate a listener for : ${JSON.stringify(data)}`)
      await mongooseEvents()
    }
  })


  // socket.on('listenCall', async (data) => {
  //   if (data && Object.keys(data).length) {
  //     console.log(`LISTEN_EVEN :: Activate a listener for : ${JSON.stringify(data)}`)
  //     await streamKeyEvent()
  //   }
  // })


  







})






