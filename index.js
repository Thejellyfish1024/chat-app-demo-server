const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const port = process.env.port || 3000

// 
app.use(cors());
app.use(express.json());

// const server = http.createServer(app);
const server = http?.createServer(app)?.listen(port)


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// console.log("io", io);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send-message", (message) => {
    // console.log("new message",message);

    // for sending message to all
    socket.broadcast.emit("receive-message", message);
  });

});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s79pxyc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db('chatDemo');
const chatCollection = database.collection('chats');
const userCollection = database.collection('users');



app.get('/all-chats', async (req, res) => {
  const result = await chatCollection.find().toArray()
  res.send(result)
})
app.get('/user/id', async (req, res) => {
  const id = req?.params?.id
  const result = await userCollection.findOne({_id : new ObjectId(id)})
  res.send(result)
})

app.post('/new-chat', async (req, res) => {
  const newChat = req?.body;
  console.log("hitting message", newChat);
  const result = await chatCollection?.insertOne(newChat);
  res.send(result)
})
app.post('/users', async (req, res) => {
  const user = req?.body;
  console.log("hitting user", user);
  const result = await userCollection?.insertOne(user);
  res.send(result)
})





async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// server.listen(3001, () => {
//   console.log("SERVER IS RUNNING in 3001");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })