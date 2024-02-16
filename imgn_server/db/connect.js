const { default: mongoose } = require("mongoose");

exports.connect = async () => {
    mongoose.connect(process.env.DB).then(() => {
        console.log("DB Connected!");
    })
}