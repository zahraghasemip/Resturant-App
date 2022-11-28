const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const HomeRoutes = require("./routes/HomeRoutes");
const UserRoutes = require("./routes/UserRoutes");
const CustomerRoutes = require("./routes/CustomerRoutes");
const app = express();
//middleware
app.use(express.json());

//routes
app.use(HomeRoutes);
app.use(UserRoutes);
app.use(CustomerRoutes);
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
