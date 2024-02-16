const { Schema, model } = require("mongoose");

const tagsSchema = new Schema({
    tag: String,
}, { timestamps: true });

exports.tags = model("tags", tagsSchema);