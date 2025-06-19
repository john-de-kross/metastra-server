const User = require('../MODELS/userModel');
const AppError = require('./ERROR/appError')

exports.changePassword = async (req, res, next) => {
    try {
        const {email, newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) return next(new AppError('Password is required', 400));

        if (newPassword.length < 8) return next(new AppError('Password must be at least 8 characters', 400));

        if (newPassword !== confirmPassword) return next(new AppError('Passwords do not match', 400));


        const user = await User.findOne({ email }).select('+password');

        if (!user) return next(new AppError('User not found', 404));

        user.password = newPassword;
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password changedd successfully'
        })

        

    } catch (error) {
        next(error)
       
    }

}