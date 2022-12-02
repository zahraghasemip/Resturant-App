const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const Kavenegar = require("kavenegar");
const NodeCache = require("node-cache");

const api = Kavenegar.KavenegarApi({
  apikey: "",
});
const UserModel = require("../models/UserModel");
const {
  loginValidator,
  registerValidator,
} = require("../validators/UserValidator");
const Auth = require("../middlewares/Auth");
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
router.get("/api/users/sendCode", Auth, async (req, res) => {
  const id = req.user._id;
  const user = await UserModel.findById(id);
  if (!user) res.status(404).send("user not found");
  const number = Math.floor(Math.random() * 90000 + 10000);
  const myCache = new NodeCache({ stdTTL: 3 * 60 * 60, checkperiod: 8 * 60 });
  myCache.set(req.user.phone, number);
  api.Send(
    {
      message: `verification code:${number}`,
      sender: "1000596446",
      receptor: user.phone,
    },
    function (responce, status) {
      res.status(status).send(responce);
    },
  );
});
module.exports = router;
