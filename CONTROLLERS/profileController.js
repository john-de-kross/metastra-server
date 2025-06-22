const User = require('../MODELS/userModel');
const AppError = require('../CONTROLLERS/ERROR/appError')


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