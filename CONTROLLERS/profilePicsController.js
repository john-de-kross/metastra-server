const User = require('../MODELS/userModel');
const AppError = require('./ERROR/appError');

exports.profilePicsUpdate = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) return next(new AppError('User not found', 404));

        
        const data = await User.findByIdAndUpdate(userId, {
            profilePics: profilePic
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Profile picture updated",
            data: {
                data
            }
        });

        


    } catch (err) {
        next(err);
    }
}