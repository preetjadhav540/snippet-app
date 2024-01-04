// BUILD THE MONGO URI CONNECTION STRING
const mongoose = require("mongoose");
const { username, password, projectname } = require("../config.json");
const mongoURL = `mongodb+srv://${username}:${password}@cluster0.hijvmxe.mongodb.net/${projectname}?retryWrites=true&w=majority`;

// CONNECT TO MONGO DB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Succesfully connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };