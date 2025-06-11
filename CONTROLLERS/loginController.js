const User = require('../MODELS/userModel');
const bcrypt = require('bcrypt')

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)

        const user = await User.findOne({ email }).select('+password');
        console.log(user.password)
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        
        const isPassword = await bcrypt.compare(password, user.password);
        console.log(user.password)

        if (!isPassword) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'

            })
        }

        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: 'User is not verified' 
            })
        }

        return res.status(200).json({
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