const User = require('../MODELS/userModel');

exports.changePassword = async (req, res, next) => {
    try {
        const {email, newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) return res.status(400).json({ success: false, message: 'Please don\'t leave any field empty' });

        if (newPassword.length < 8) return res.status(400).json({ success: false, message: 'Password must contain at least 8 characters' });

        if (newPassword !== confirmPassword) return res.status(400).json({ success: false, message: 'Password does not match' });


        const user = await User.findOne({ email }).select('+password');

        if (!user) return res.status(404).json({ success: false, message: 'User does not exist' });

        user.password = newPassword;

        res.status(200).json({
            success: true,
            message: 'Password changedd successfully'
        })

        await user.save();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error occurred while trying to change password',
            error: error.message
        })
    }

}