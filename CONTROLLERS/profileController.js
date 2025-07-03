const User = require('../MODELS/userModel');
const AppError = require('../CONTROLLERS/ERROR/appError');
const AboutUser = require('../MODELS/aboutProfile');
const SendRequest = require('../MODELS/requestModel');
const Friends = require('../MODELS/friendsModel');
const UserPost = require('../MODELS/postModel');


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


exports.viewUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userProfile = await User.findById(userId).select("firstname surname profilePics gender dob createdAt coverPics phone email");

        if (!userProfile) return next(new AppError('USer not found', 404));
        const friends = await Friends.find({me: userId}).select('friend')

        const userInfo = await AboutUser.findOne({ user: userId }).lean();
        const userPosts = await UserPost.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate('author', 'firstname surname profilePics')
            .select('content imageUrl createdAt')
            .lean();
        

        res.status(200).json({
            success: true,
            message: "success",
            data: {
                profile: userProfile || {},
                about: userInfo || {},
                friends: friends || {},
                posts: userPosts || {}
            },
        });
        
    } catch (error) {
        next(error);
    }
}

exports.createPost = async (req, res, next) => {
    try {
        const { imageUrl, text } = req.body;
        const user = await User.findById(req.user.id).exec();
        if (!user) return next(new AppError('User not found', 404));

        if (!text || imageUrl) return next(new AppError('You can post, no content', 400));

        const post = await UserPost.create({ imageUrl: imageUrl, postText: text, isProfile: false, author: req.user.id });

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: {
                post
            }
        });



        
        
    } catch (err) {
        next(err)
    }
}