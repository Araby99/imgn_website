const { Schema, model } = require("mongoose");

const articlesSchema = new Schema({
    title: String,
    subTitle: String,
    hero: String,
    description: String,
    tags: Array,
}, { timestamps: true }).index({ '$**': 'text' });

exports.articles = model("articles", articlesSchema);