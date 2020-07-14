const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const Place = require("./place");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // unique is supported by pkg named "mongoose-unique-validator"
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place'}],
});

// add this plugin to userSchema
userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("User", userSchema);
