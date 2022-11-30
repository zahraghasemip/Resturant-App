const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const UserModel = require("../models/UserModel");
const {
  loginValidator,
  registerValidator,
} = require("../validators/UserValidator");
router.post("/api/users/register", async (req, res) => {
  const { error } = registerValidator(req.body);
  if (error) return res.status(400).send({ message: error.message });
  let user = await UserModel.findOne({ phone: req.body.phone });
  if (user)
    return res.status(400).send({ message: "this user registered before" });
  user = new UserModel(_.pick(req.body, ["name", "phone", "password"]));
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(req.body.password, salt);
  user.password = pass;
  user = await user.save();

  const token = await user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(req.body, ["name", "phone", "_id", "role"]));
});
router.post("/api/users/login", async (req, res) => {
  const { error } = loginValidator(req.body);
  if (error) return res.status(400).send({ message: error.message });
  let user = await UserModel.findOne({ phone: req.body.phone });
  if (!user)
    return res.status(400).send({ message: "user or password incorrect" });

  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result)
    return res.status(400).send({ message: "user or password incorrect" });
  const data = {
    _id: user._id,
    name: user.name,
  };
  const token = jwt.sign(data, config.get("jwtPrivateKey"));
  res.header("x-auth-token", token).status(200).send({ success: true });
});
module.exports = router;
