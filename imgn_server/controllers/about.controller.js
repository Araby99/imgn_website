const { about } = require("../models/about.model")

const _id = "65cf260d032f5fa322e19eca";
exports.getAbout = (req, res) => {
    about.findById(_id).then(result => {
        res.send(result)
    })
}

exports.updateAbout = (req, res) => {
    about.findByIdAndUpdate(_id, req.body, { new: true }).then(result => {
        res.send(result)
    })
}