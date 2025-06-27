const mongoose = require('mongoose');
const User = require('../MODELS/userModel')


const AboutUserSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    work: {
        type: String,
        default: ""
        
    },
    
    education: {
        type: String,
        default: ""
        
    },

    location: {
        type: String,
        default: ''
    },

    relationship: {
        type: String,
        required: true,
        enum: ['Single', 'Married', 'Engaged', 'Complicated'], 
        default: 'Single',
    },

    bio: {
        type: String,
        maxlength: 160,
        default: ""

    },

    joined: {
        type: Date,
    }
});

AboutUserSchema.index({ user: 1}, { unique: true });

AboutUserSchema.pre('save', async function (next) {
    try {
        if (!this.joined) {
            const user = await User.findById(this.user);
            if (user) this.joined = user.createdAt;
        }
        next()
    } catch (err) {
        return next(err)
    }
    
})

const AboutUser = mongoose.model('AboutUser', AboutUserSchema);
module.exports = AboutUser