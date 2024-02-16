const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { admins } = require("../models/admin.mode");

exports.login = (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        admins.findOne({ username }).then(admin => {
            if (admin) {
                bcrypt.compare(password, admin.password).then(check => {
                    if (check) {
                        jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
                            if (!err) {
                                res.send(token);
                            } else {
                                res.sendStatus(400);
                            }
                        })
                    } else {
                        res.sendStatus(401);
                    }
                })
            } else {
                res.sendStatus(404);
            }
        })
    } else {
        res.sendStatus(400)
    }
}

exports.createAdmin = (req, res) => {
    const { username, password, secret } = req.body;
    if (username && password) {
        if (secret == process.env.CREATE_ADMIN) {
            admins.findOne({ username }).then(user => {
                if (!user) {
                    bcrypt.hash(password, 12).then(hash => {
                        admins.create({ username, password: hash }).then(result => {
                            res.status(201).send(result)
                        })
                    })
                } else {
                    res.sendStatus(409)
                }
            })
        } else {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(400)
    }
}

exports.updateAdmin = (req, res) => {
    const { _id } = req.params;
    const { username, oldPass, newPass } = req.body;
    admins.findOne({ _id }).then(user => {
        if (user) {
            if (oldPass) {
                bcrypt.compare(oldPass, user.password).then(check => {
                    if (check) {
                        if (username) {
                            admins.findOne({ username }).then(dup => {
                                if (!dup || dup._id == _id) {
                                    bcrypt.hash(newPass, 12).then(hash => {
                                        admins.findByIdAndUpdate({ _id }, { username, password: hash }, { new: true }).then(result => {
                                            res.status(201).send(result)
                                        })
                                    })
                                } else {
                                    res.sendStatus(409)
                                }
                            })
                        } else {
                            bcrypt.hash(newPass, 12).then(hash => {
                                admins.findByIdAndUpdate({ _id }, { password: hash }, { new: true }).then(result => {
                                    res.status(201).send(result)
                                })
                            })
                        }
                    } else {
                        res.sendStatus(401)
                    }
                })
            } else if (username) {
                admins.findOne({ username }).then(dup => {
                    if (!dup || dup._id == _id) {
                        admins.findByIdAndUpdate({ _id }, { username }, { new: true }).then(result => {
                            res.status(201).send(result)
                        })
                    } else {
                        res.sendStatus(409)
                    }
                })
            } else {
                res.send(200)
            }
        } else {
            res.sendStatus(404)
        }
    })
}