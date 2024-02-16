const { Schema, model } = require("mongoose");

const BODSchema = new Schema({
    name: String,
    position: String,
    image: String,
    rank: Number
}, { timestamps: true }).index({ '$**': 'text' });

exports.BOD = model("BOD", BODSchema);