const jwt = require("jsonwebtoken");
const { admins } = require("../models/admin.mode")

exports.admin = (req, res, next) => {
    const token = req.headers["admin"];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
            admins.findById(decoded.id).then(admin => {
                if (admin) {
                    next();
                } else {
                    res.sendStatus(401);
                }
            })
        } else {
            res.sendStatus(401);
        }
    })
}