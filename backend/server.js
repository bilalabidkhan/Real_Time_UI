const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send_notification", (data) => {
    io.emit("receive_notification", {
      ...data,
      time: new Date().toLocaleTimeString(),
    });
  });
});

server.listen(3001, () => {
  console.log("Backend running on port 3001");
});