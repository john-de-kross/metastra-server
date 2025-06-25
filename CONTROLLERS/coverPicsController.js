const User = require('../MODELS/userModel');
const AppError = require('./ERROR/appError');



exports.uploadCoverPics = async (req, res, next) => {
    try {
        const { coverPic } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return next(new AppError('User not found', 404));

        const data = await user.findByIdAndUpdate(req.user.id, { coverPics: coverPic });

        res.status(200).json({
            success: true,
            message: 'Cover-picture successfully updated'
        })
        
       
    } catch (err) {
        next(err)
    }
}