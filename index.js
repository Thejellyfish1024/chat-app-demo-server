const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send-message", (message) => {
    console.log("new message",message);
    
    // for sending message to all
    socket.broadcast.emit("receive-message", message);
  });

});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});