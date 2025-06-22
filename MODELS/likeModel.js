const mongoose = require('mongoose');

const LikeSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        reqquired: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    like: {
        type: Number,
        default: 0
    },

    likedAt: {
        type: Date,
        default: Date.now
    }

})

const PostLike = mongoose.model('Like', LikeSchema);

module.exports = PostLike;