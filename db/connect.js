const mongoose = require("mongoose")

//u3ldmau9lXwZoUje
let url = "mongodb+srv://yosialukumai:Sv9JX3X5k3ceNfOz@cluster0.l51zdtq.mongodb.net/?retryWrites=true&w=majority"
let urls ="mongodb+srv://yosialukumai:Sv9JX3X5k3ceNfOz@cluster0.l51zdtq.mongodb.net/PLant_Monitor?retryWrites=true&w=majority"

const connectDb = async () => {
    console.log("trying connecting to the database...");
    mongoose.set('strictQuery', false);
    var connected = await mongoose.connect(url)
    if (connected) {
        console.log("sucessfully connected to db")
    } else {
        console.log("Failed to connect to database")
    }
}



const reconnect = async () => {
    try {
        let connected = await mongoose.connect("mongodb+srv://yosialukumai:Z80FCTf8MF5rVRcE@cluster0.94yu98v.mongodb.net/");
        console.log(connected);
        return connected;
    } catch (error) {
        console.log("Error in reconnecting");
        return error
    }

}


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect("mongodb+srv://yosialukumai:Z80FCTf8MF5rVRcE@cluster0.94yu98v.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // make the process fail
        process.exit(1);
    }
}
module.exports = {
    connectDb,
    reconnect,
    connectDB
}