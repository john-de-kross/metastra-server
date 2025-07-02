const User = require('../MODELS/userModel');
const AppError = require('./ERROR/appError');
const userPosts = require('../MODELS/postModel')



exports.uploadCoverPics = async (req, res, next) => {
    try {
        const { coverPic } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return next(new AppError('User not found', 404));

        user.coverPics = coverPic
        await user.save();
        const userSex = user.gender === 'Male' ? 'his' : 'her'

        const posts = await userPosts.create({ content: `updated ${userSex} cover picture`, author: req.user.id, imageUrl: coverPic});
        res.status(200).json({
            success: true,
            message: 'Cover-picture successfully updated',
            data: {
                posts
            }
        })
        
       
    } catch (err) {
        next(err)
    }
}