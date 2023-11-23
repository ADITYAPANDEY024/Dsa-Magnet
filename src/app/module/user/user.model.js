
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String,
        minlength: 10,
        maxlength: 10
    },
    profilePic: {
        type: String,

    },
    isActive: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('user', userModel);
