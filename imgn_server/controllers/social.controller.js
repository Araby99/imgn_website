const { social } = require("../models/social.model");

exports.getAllSocial = (req, res) => {
    social.find({}).sort({ index: 1 }).then(result => {
        res.send(result)
    })
}

exports.createSocial = (req, res) => {
    const { name, icon, link } = req.body;
    if (!name || !icon || !link) {
        res.sendStatus(400)
    } else {
        social.create(req.body).then(result => {
            res.status(201).send(result)
        })
    }
}

exports.updateSocial = (req, res) => {
    let i = 0;
    const updateAll = () => {
        const { _id } = req.body[i];
        delete req.body[i]._id
        social.updateOne({ _id }, { $set: req.body[i] }).then(() => {
            if (req.body.length > ++i) {
                updateAll()
            } else {
                res.sendStatus(200)
            }
        })
    }
    updateAll();
}

exports.deleteSocial = (req, res) => {
    const { id } = req.params;
    social.findByIdAndDelete(id).then(() => {
        res.sendStatus(200)
    })
}