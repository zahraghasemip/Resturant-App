const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const {
  loginValidator,
  registerValidator,
} = require("../validators/UserValidator");
router.post("api/users/register", async (req, res) => {
  const { error } = registerValidator(req.body);
  if (error) return res.status(400).send({ message: error.message });
  let user = await UserModel.findOne({ phone: req.body.phone });
  if (user)
    return res.status(400).send({ message: "this user registered before" });
  user = new UserModel({
    name: req.body.name,
    phone: req.body.phone,
    password: req.body.password,
  });
  user = await user.save();
  res.send(user);
});
module.exports = router;
