const mongoose = require('mongoose');


const SendFriendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined'],
        default: 'Request sent'
    },

}, {timestamps: true})

SendFriendRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });
const SendRequest = mongoose.model('Request', SendFriendRequestSchema);
module.exports = SendRequest;