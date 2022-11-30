const mongoose = require("mongoose");
const { schema } = require("./CustomerModel");
const jwt = require("jsonwebtoken");
const config = require("config");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, minlength: 11, maxlength: 11 },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
});
userSchema.methods.generateAuthToken = function () {
  const data = {
    _id: this._id,
    name: this.name,
    role: this.role,
  };
  return jwt.sign(data, config.get("jwtPrivateKey"));
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
