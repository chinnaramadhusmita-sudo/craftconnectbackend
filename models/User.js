const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  roles: {
  type: [String],
  enum: ["buyer", "seller"],
  default: ["buyer"],
},
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);