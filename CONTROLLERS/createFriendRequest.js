const SendRequest = require('../MODELS/requestModel');
const User = require('../MODELS/userModel');
const AppError = require('../CONTROLLERS/ERROR/appError')

exports.createRequest = async (req, res, next) => {
    try {
        const { receiverId } = req.body; 
        const senderId = req.user.id;
        const userSocketMap = req.app.get('userSocketMap');
        const io = req.app.get('io');
        const sender = await User.findById(senderId ).select('firstname surname');
        const receiver = await User.findById( receiverId ).select('firstname surname');

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
        });

        const senderName = await User.findById(senderId).select('firstname surname');

        const receiverSocketId = userSocketMap.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newFriendRequest', {
                sender: `${senderName.surname} ${senderName.firstname}`
            })
           
        }
        

    } catch (error) {
        next(error)
    }



    
}