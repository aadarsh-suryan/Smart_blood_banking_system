const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  preferredHospital: { type: String, default: "" }
});

module.exports = mongoose.model("User", UserSchema);
