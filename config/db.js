const mongoose = require("mongoose");
const clc = require("cli-color")
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(clc.bgMagenta(`DB connected -> Connected to ${conn.connection.host}`));
  } catch (err) {
    console.log(clc.bgRedBright.white("Error occured:"));
    console.log(err.message);
  }
};

module.exports = connectDB;
