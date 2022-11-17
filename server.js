const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const HomeRoutes = require("./routes/HomeRoutes");
const UserRoutes = require("./routes/UserRoutes");
const app = express();
//routes
app.use(HomeRoutes);
app.use(UserRoutes);
//database configuration
mongoose
  .connect("mongodb://localhost:27017", {
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
