const app = require("express")();
const express = require("express");
const dbConfig = require("./db/connect");
const userRoutes = require("./routes/users");
const dataRoutes = require("./routes/data")
const cors = require("cors");
const {Server} = require('socket.io')
const http = require("http")
require("dotenv").config();
// database configuration
dbConfig.connectDb();

//cors config
// limiting all the acces that comes from other hosting
app.use(cors());
// allowing the json and url encoded in the requesst body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/test", (req, res) => {
  res.send("LOL testing wooh");
});

// bringing all the routes
userRoutes.userRoutes(app);

// routes for handling the data
dataRoutes.dataRoutes(app);

const server = http.createServer(app)
const io = new Server(server, {
  cors:{
    origin:"*",
    methods: ["GET", "POST"]
  }
})

io.on("connect", (socket) => {
  console.log('connected')
  // console.log(socket);
  socket.on("disconnect", ()=> {
    console.log("client disconnected..");
  })
})
server.listen(process.env.PORT, () => {
  console.log(`App running and connected to port ${process.env.PORT}`);
});
module.exports.Socket =io