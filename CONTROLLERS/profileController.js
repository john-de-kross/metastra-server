const User = require('../MODELS/userModel');
const AppError = require('../CONTROLLERS/ERROR/appError');
const AboutUser = require('../MODELS/aboutProfile');
const SendRequest = require('../MODELS/requestModel');
const Friends = require('../MODELS/friendsModel');


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

exports.createAboutUser = async (req, res, next) => {
    try {
        const { work, relationship, education, location, bio } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return next(new AppError('User not found', 404));

        const data = await AboutUser.findOneAndUpdate({ user: req.user.id },
            { work, relationship, education, location, bio }, {new: true, upsert: true, runValidators: true});

        res.status(201).json({
            success: true,
            message: 'About user profile Updated',
            data: {
                data
            }
        })


    } catch (error) {
        next(error);
    }
}


exports.aboutProfile = async (req, res, next) => {
    try {
        const userAboutProfile = await AboutUser.findOne({user: req.user.id});

        if (!userAboutProfile) return next(new AppError('User not found', 404))
        
        res.status(200).json({
            success: true,
            message: "Success",
            data: {
                userAboutProfile
            }
        })
    } catch (err) {
        next(err)
    }
}


exports.suggestedUsers = async (req, res, next) => {
    try {

        const currentUserId = req.user.id;
        const existingFriend = await Friends.find({ me: currentUserId }).select('friend');
        const sentRequest = await SendRequest.find({ sender: currentUserId }).select('receiver');
        const notVerified = await User.find({ isVerified: false });
        


        //get there IDs
        const existingFriendId = existingFriend.map(f => f.friend.toString());
        const sentRequestId = sentRequest.map(request => request.toString());
        const notVerifiedId = notVerified.map(notId => notId._id);
        

        const users = await User.find({
            _id: {
                $nin: [currentUserId, ...existingFriendId, ...sentRequestId, ...notVerifiedId],

            }
        }).select('firstname surname profilePics')
        
        res.status(200).json({
            message: "success",
            success: true,
            data: {
                users
            }

        })
    } catch (error) {
        next(error);
    }
}