const { Schema, model } = require("mongoose");

const socialSchema = new Schema({
    name: String,
    icon: String,
    link: String,
    index: Number
}, { timestamps: true });

exports.social = model("social", socialSchema);