const User = require('../MODELS/userModel');
const AppError = require('../CONTROLLERS/ERROR/appError');
const AboutUser = require('../MODELS/aboutProfile');


exports.getUserProfile = async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        if (!currentUserId) return next(new AppError('Access denied', 403))

        const currentUser = await User.findById(currentUserId).select("-password")
        

        return res.status(200).json({
            success: true,
            message: 'Success',
            data: {
                currentUser
            }
        })
        
    } catch (error) {
        next(error)
    }
}

exports.createAboutUser = async (req, res, next) => {
    try {
        const { work, relationship, education, location, bio } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return next(new AppError('User not found', 404));

        const data = await AboutUser.findOneAndUpdate({ user: req.user.id },
            { work, relationship, education, location, bio }, {new: true, upsert: true, runValidators: true});

        res.status(201).json({
            success: true,
            message: 'About user profile Updated',
            data: {
                data
            }
        })


    } catch (error) {
        next(error);
    }
}


exports.aboutProfile = async (req, res, next) => {
    try {
        const userAboutProfile = await AboutUser.findOne({user: req.user.id});

        if (!userAboutProfile) return next(new AppError('User not found', 404))
        
        res.status(200).json({
            success: true,
            message: "Success",
            data: {
                userAboutProfile
            }
        })
    } catch (err) {
        next(err)
    }
}