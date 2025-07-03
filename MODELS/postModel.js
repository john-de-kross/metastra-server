const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        default: ''
    },

    imageUrl: {
        type: String,
    },

    isProfile: {
        type: Boolean,
        default: false

    },

    createdAt: {
        type: Date,
        default: Date.now
    } 

});

const UserPost = mongoose.model('Post', PostSchema);
module.exports = UserPost;