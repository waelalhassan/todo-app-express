const mongoose = require("mongoose")

const tasks = mongoose.model("tasks", mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {timestamps: true} ));

module.exports = tasks


