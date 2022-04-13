const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const Chat = require("./Chats");

mongoose.connect("mongodb://localhost:27017/chats");

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  Chat.find().then((result) => {
    socket.emit("receive chat", result);
  });
  // emit chat message to client
  socket.on("chat message", (data) => {
    const chat = new Chat({ name: data.nickname, msg: data.message });
    chat.save().then(() => {
      io.sockets.emit("chat message", data);
    });
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

server.listen(3000);
