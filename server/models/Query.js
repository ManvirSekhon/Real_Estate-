// models/Query.js
const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("Query", querySchema);