const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            message: props => `${props.value} is not a valid email`
        },
        required: function () {return !this.phone}
    },

    phone: {
        type: String,
        unique: true,
        validate: {
            validator: val => /^[0-9]{10,15}$/.test(val),
            message: props => `${props.value} is not a valid phone number`
        },
        required: function () {
            return !this.email
        }

    },


    dob: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
        
    },

    city: {
        type: String,
    },

    state: {
        type: String
    },

    country: {
        type: String
    },
    
    bio: {
        type: String,
        default: '',
        maxlength: 160
    },

    profilePics: {
        type: String,
        default: 'https://example.com/default-profile.png'
    },

    coverPics: {
        type: String,
        default: 'https://example.com/default-cover.png'

    },

    relationship: {
        type: String,
        defult: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }


})

const User = mongoose.model('User', userSchema);

module.exports = User;