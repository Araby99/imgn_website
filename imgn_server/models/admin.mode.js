const { Schema, model } = require("mongoose");

const adminsSchema = new Schema({
    username: String,
    password: String,
}, { timestamps: true });

exports.admins = model("admins", adminsSchema);