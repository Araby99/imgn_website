const { BOD } = require("../models/BOD.model")

exports.getAllBOD = (req, res) => {
    BOD.find({}).then(result => {
        res.send(result)
    }).catch(err => console.log(err))
}

exports.getBOD = (req, res) => {
    const { _id } = req.params;
    BOD.findById(_id).then(result => {
        res.send(result)
    }).catch(err => res.sendStatus(404))
}

exports.createBOD = (req, res) => {
    BOD.insertMany(req.body).then(result => {
        res.send(result);
    })
}

exports.updateBOD = (req, res) => {
    const { _id } = req.params;
    BOD.findOneAndUpdate({ _id }, req.body, { new: true }).then(result => {
        res.send(result)
    })
}

exports.deleteBOD = (req, res) => {
    const { _id } = req.params;
    BOD.findByIdAndDelete(_id).then(result => res.sendStatus(200))
}