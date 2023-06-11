#!/usr/bin/env node
import app from '../app';
import debugLib from 'debug';
import http from 'http';
import { Server } from 'socket.io'
import { MongoClient } from 'mongodb'
import mongoose from "mongoose"


var debug = debugLib('myapp:server');
var port = normalizePort(process.env.PORT || '5000')
app.set('port', port)
var httpServer = http.createServer(app)



console.log(`Luckily everyone has access to mongodb`)


const io = new Server(httpServer, { cors: { origin: '*' } })
const CONNECTION = process.env.MONGODB_CONNECTION

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    httpServer.listen(port);
    httpServer.on('error', onError);
    httpServer.on('listening', onListening);
    console.log(`Listening @ Port ${port} | Mongoose is successfully connected`)
  })
  .catch((error) => console.log(`${error} Mongodb did not connect`));



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

})







/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
