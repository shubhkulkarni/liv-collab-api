const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const app = express();
const httpServer = http.createServer(app);
const cors = require("cors");
const socketio = require("socket.io");

const io = socketio(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const dev_env = process.env.NODE_ENV.trim() === "development";
dev_env
  ? dotenv.config({ path: "./dev.config.env" })
  : dotenv.config({ path: "./prod.config.env" });
// require("./src/database.js");
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
  console.log("socket connection established");

  socket.on("JOIN_ROOM", (roomId) => {
    socket.join(roomId);
    socket.on("MESSAGE", (msg) => {
      socket.compress(true).to(roomId).emit("MESSAGE", msg);
    });

    // console.log(roomId);
  });
});

const server = httpServer.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("uncaughtException occured :(");
  server.close(() => {
    process.exit(1);
  });
});

process.on("unHandledRejection", (err) => {
  console.log(err.message);
  console.log("unHandledRejection occured :(");
  server.close(() => {
    process.exit(1);
  });
});
