const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: String,
    image: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const UserPost = mongoose.model('Post', PostSchema);
module.exports = UserPost;