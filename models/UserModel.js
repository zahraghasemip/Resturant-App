const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, minlength: 11, maxlength: 11 },
  password: { type: String, required: true },
});
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
