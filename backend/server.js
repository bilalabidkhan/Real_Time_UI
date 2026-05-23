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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});