const User = require('../MODELS/userModel');
const AppError = require('./ERROR/appError');
const userPost = require('../MODELS/postModel');

exports.profilePicsUpdate = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) return next(new AppError('User not found', 404));

        
        const data = await User.findByIdAndUpdate(userId, {
            profilePics: profilePic
        }, { new: true });

        const userSex = user?.gender === 'Male' ? "his" : 'her'
        const post = await userPost.create({imageUrl: profilePic, author: userId, content: `updated ${userSex} profile`})

        res.status(200).json({
            success: true,
            message: `Profile picture updated and added to posts`,
            data: {
                data,
                post
            }
        });

    } catch (err) {
        next(err);
    }
}