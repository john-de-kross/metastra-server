const SendRequest = require('../MODELS/requestModel');
const User = require('../MODELS/userModel');
const AppError = require('../CONTROLLERS/ERROR/appError')

exports.createRequest = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.body; 
        const sender = await User.findById(senderId ).select('firstname surname');
        const receiver = await User.findById({ receiverId }).select('firstname surname');

        if (!sender || !receiver) return next(new AppError('Sender or receiver not found', 404)); 

        const existingRequest = await SendRequest.findOne({
            sender: senderId,
            receiver: receiverId
        })
    
        if (existingRequest) return next(new AppError('Friend request already sent', 400));

        const request = await SendRequest.create({
            sender: senderId,
            receiver: receiverId
        });

        res.status(201).json({
            success: true,
            message: "Request sent successfully",
            data: {
                sender: sender,
                receiver: receiver,
                request
            }
        })

    } catch (error) {
        next(error)
    }



    
}