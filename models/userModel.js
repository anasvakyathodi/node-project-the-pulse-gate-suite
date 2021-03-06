const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  displayName: { type: String },
  userType: { type: String, required: true },
  tokens: [{ token: { type: String, required: true } }],
});

module.exports = User = mongoose.model("user", userSchema);
