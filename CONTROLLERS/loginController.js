const User = require('../MODELS/userModel');
const bcrypt = require('bcrypt')

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        const hashedPass = user.password;
        const isPasword = await bcrypt.compare(password, hashedPass);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        if (!isPasword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'

            })
        }

        if (isPasword && user && !user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'User is not verified'
            })
        }

        return re.status(200).json({
            success: true,
            message: 'Login successful'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to login user',
            error: error.message
        })
    }
}