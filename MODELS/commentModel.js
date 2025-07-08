const mongoose = require('mongoose');


const CommentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    comment: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
    
})

const PostComment = mongoose.model('Comment', CommentSchema);

module.exports = PostComment;