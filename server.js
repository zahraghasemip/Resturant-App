const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");
const HomeRoutes = require("./routes/HomeRoutes");
const UserRoutes = require("./routes/UserRoutes");
const CustomerRoutes = require("./routes/CustomerRoutes");
const ErrorHandling = require("./middlewares/ErrorHandling");
require("express-async-errors");
require("winston-mongodb");
const app = express();
winston.add(new winston.transports.File({ filename: "errlog.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost:27017/awsomereturant",
  }),
);
//middleware
app.use(express.json());
//routes
app.use(HomeRoutes);
app.use(UserRoutes);
app.use(CustomerRoutes);
app.use(ErrorHandling);
//HANDLING SYNC && ASYNC ERRORS
process.on("uncaughtException", (err) => {
  console.log(err);
  winston.error(err.message);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
  winston.error(err.message);
});
//engine
app.set("view engine", "pug");
app.set("views", "./views");
mongoose
  .connect("mongodb://localhost:27017/awsomereturant", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.error("db not connected", err);
  });

const port = process.env.myPort || 3000;
app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`app listen to port ${port}`);
});
