const { tags } = require("../models/tags.model");

exports.getAllTags = (req, res) => tags.find({}).then(result => res.send(result))
exports.createTags = (req, res) => {
    tags.create(req.body).then(result => res.send(result))
}