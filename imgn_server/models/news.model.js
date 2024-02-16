const { Schema, model } = require("mongoose");

const newsSchema = new Schema({
    title: String,
    subTitle: String,
    hero: String,
    description: String,
    tags: Array,
    related: Array
}, { timestamps: true }).index({ '$**': 'text' });

exports.news = model("news", newsSchema);