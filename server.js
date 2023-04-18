require("dotenv").config();
const clc = require("cli-color");
const express = require("express");
const cors = require("cors");


const connectDB = require("./config/db");
const userRouter = require("./routes/user.router");
const tweetRouter = require("./routes/tweet.router")
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  process.stdout.write(clc.reset);
  console.log(clc.bgGreenBright.white(`Server running on ${PORT}`));
  connectDB();
});
