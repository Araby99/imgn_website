const { Schema, model } = require("mongoose");

const aboutSchema = new Schema({
    about: String,
}, { timestamps: true }).index({ '$**': 'text' });

exports.about = model("about", aboutSchema);