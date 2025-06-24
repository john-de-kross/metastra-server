const mongoose = require("mongoose");


const FriendSchema = mongoose.Schema({
    me: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },

    friendAt: {
        type: Date,
        default: Date.now

    }
})
FriendSchema.index({ me: 1, friend: 1 }, { unique: true });

const Friends = mongoose.model('Friend', FriendSchema);

module.exports = Friends