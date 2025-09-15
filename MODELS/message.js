const mongoose = require('mongoose');
const User = require("../MODELS/userModel");


const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        trim: true,
        required: true

    },

    seen: {
        type: Boolean,
        default: false
    },
    
    sentAt: {
        type: Date,
        default: Date.now
    },

    media: {
        type: String
    }


}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema)