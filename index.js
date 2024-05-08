const app = require("express")();
const express = require("express");
const dbConfig = require("./db/connect");
const picModel = require("./models/pics")
const multer = require("multer")
const path = require("path")
const userRoutes = require("./routes/users");
const dataRoutes = require("./routes/data")
const cors = require("cors");
const { Server } = require('socket.io')
const http = require("http");
const BoxModel = require("./models/Boxs")
const { createOutput } = require("./utils");
require("dotenv").config();
dbConfig.connectDb();
const net = require('net');

const client = new net.Socket();

// Connect to the Python socket server
const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 3200;

function reconnect() {
  client.connect(SERVER_PORT, SERVER_HOST, function () {
    console.log('=^^=====Connected to Python socket server.===^^==');
  });

}
// Handle data received from the Python socket server
client.on('data', async function (data) {
  console.log("=================INCOMING DATA FROM PY SERVER==================");
  try {
    let receivedData = JSON.parse(data.toString())
    console.log("Received data:  ", receivedData);
    const saved = await BoxModel.create({ average: receivedData.average, rectangles: receivedData.rectangles })
    if (saved) {
      console.log("Saved well the rectangelss");
    } else {
      console.log("Failed to save the boxess....");
    }
    client.destroy()
  } catch (error) {
    console.log("Error in parsing the json from the python server");
    console.log(error.message);
    client.destroy()
  }
});


//cors config
// limiting all the acces that comes from other hosting
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/test", (req, res) => {
  res.send("LOL testing wooh");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Uploads will be stored in the "uploads/" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file) {
    cb(null, true); // Accept only image files
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });


app.post("/data/upload/image", upload.single("image"), function (req, res, next) {
  try {

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    let imgPath = path.join("uploads", req.file.filename);
    // saving the image filename into database
    let saved = picModel.create({ imgPath })
    // before this let 
    reconnect()
    console.log("Sending file name:   ", req.file.filename);
    client.write(req.file.filename)
    if (saved) res.json(createOutput(false, "file saved successful.."));



  } catch (error) {
    res.json(createOutput(false, error.message))
  }

})

// bringing all the routes
userRoutes.userRoutes(app);

// routes for handling the data
dataRoutes.dataRoutes(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/data/images", async (req, res) => {
  try {
    let images = await picModel.find(null, "createdAt imgPath", { sort: { createdAt: -1 } })
    if (images) {
      res.json(createOutput(true, { images }, false))
    } else {
      res.json(createOutput(true, "no saved images"))
    }
  } catch (error) {
    res.json(createOutput(true, error?.message))
  }
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connect", (socket) => {
  console.log('connected')
  socket.on("disconnect", () => {
    console.log("client disconnected..");
  })
})
server.listen(process.env.PORT, () => {
  console.log(`App running and connected to port ${process.env.PORT}`);
});
module.exports.Socket = io






// SVELPA  (Safe Vegetables and Plants )
// A device that traps agricultural pests using aroma. It a device that will be revolutionize how agriculture is done, by moving away from harmful farming techniques it has below objectives:
// Improve health status of civilians:  Most of farmers are exposed to harmful chemicals when they spray the pesticides to their farms which result to health problems in their nervous system and reproductive system also to the end users of the crops tend to use intake food with large amount of chemicals with SVELPA their will have clean and safe crops.
// Retain soil fertility: Since there is no use of chemical in killing pests the soil quality is kept at higher standard.
// Promote environment conservation and preservation: Some of the chemicals tends to kill sub-lethal effect to bees, reduction of fish and animal population, air pollution and water pollution. SVELPA will mitigate this effect
// Reduce costs to farmers:  The enormous cost in buying pesticides is massive to farmers with this it will be reduced large a farmer will only be required to change aroma when needed also it can be shared with different farmers. 



// We don't have enough fund to cover product finishing and commercialization procedures,
// We also need partnership with some companies which create aroma according to pheromne e.g instution like Russel IPM, 
// The massive cost to expand and scale up the project to reach large number of farmers with this innovation is still challenging, 
// We also need some support to give awareness to farmers about the effect of pesticides and how they can be using this device to tackle the challenge.


// Currently we need to be able to reduce the form factor or  size of the device making it to be more small and reliable for farmers to be able to carry around to their different farms.
// Creating of aroma according to seasonal pests.


// Assembling of material: Collecting of material needed to create the device such as Iron sheets, wood, colors and  neem leaves.
// Manufacturing of Device, Aroma and oils: Designing of device in CAD software to fit the desired shape of the the device, the design should ensures proper and efficient trapping of this pest so it has some parts to first trap them, then collect them and control them. we create the part using some machining methods such as CNC or some part using 3D-printing, then we collect aroma from the vendors or creating them ourselves depending on the pest dealt, We add oil to the device for killing these pests.
// Marketing & Maintenance: We reach out the farmers who struggle with pest and we introduce this device to them accompanied with continuous monitoring offering some maintenance when  needed such as changing of aroma depending on the crops and insects affecting the farm yield. 
// Training and awareness programs to the farmers about the device.



// One of them is organic farmers.
// The techniques used by these farmers are not efficient  and can't cover most of pest diseases and effects. It can't be done in large scale farming and it's costful too and time consuming.