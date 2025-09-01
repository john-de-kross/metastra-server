const User = require("../MODELS/userModel");
const AppError = require("../CONTROLLERS/ERROR/appError");
const AboutUser = require("../MODELS/aboutProfile");
const SendRequest = require("../MODELS/requestModel");
const Friends = require("../MODELS/friendsModel");
const UserPost = require("../MODELS/postModel");
const PostComment = require("../MODELS/commentModel");

exports.getUserProfile = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    if (!currentUserId) return next(new AppError("Access denied", 403));

    const currentUser = await User.findById(currentUserId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Success",
      data: {
        currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createAboutUser = async (req, res, next) => {
  try {
    const { work, relationship, education, location, bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError("User not found", 404));

    const data = await AboutUser.findOneAndUpdate(
      { user: req.user.id },
      { work, relationship, education, location, bio },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: "About user profile Updated",
      data: {
        data,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.aboutProfile = async (req, res, next) => {
  try {
    const userAboutProfile = await AboutUser.findOne({ user: req.user.id });

    if (!userAboutProfile) return next(new AppError("User not found", 404));

    res.status(200).json({
      success: true,
      message: "Success",
      data: {
        userAboutProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.suggestedUsers = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const existingFriend = await Friends.find({ me: currentUserId }).select(
      "friend"
    );
    const sentRequest = await SendRequest.find({
      sender: currentUserId,
    }).select("receiver");
    const notVerified = await User.find({ isVerified: false });
    const receivedReq = await SendRequest.find({receiver: currentUserId}).select('sender')

    //get there IDs
    const existingFriendId = existingFriend.map((f) => f.friend.toString());
    const sentRequestId = sentRequest.map((request) =>
      request.receiver.toString()
    );
    const notVerifiedId = notVerified.map((notId) => notId._id);
    const receivedReqId = receivedReq.map((id) => id.sender.toString());

    const users = await User.find({
      _id: {
        $nin: [
          currentUserId,
          ...existingFriendId,
          ...sentRequestId,
          ...notVerifiedId,
          ...receivedReqId
        ],
      },
    }).select("firstname surname profilePics");

    res.status(200).json({
      message: "success",
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.viewUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userProfile = await User.findById(userId).select(
      "firstname surname profilePics gender dob createdAt coverPics phone email"
    );

    if (!userProfile) return next(new AppError("USer not found", 404));
    const friends = await Friends.find({ me: userId }).select("friend");

    const userInfo = await AboutUser.findOne({ user: userId }).lean();
    const userPosts = await UserPost.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "firstname surname profilePics")
      .select("content imageUrl postText createdAt")
      .lean();

    res.status(200).json({
      success: true,
      message: "success",
      data: {
        profile: userProfile || {},
        about: userInfo || {},
        friends: friends || {},
        posts: userPosts || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { imageUrl, text } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError("User not found", 404));

    if (!text && !imageUrl)
      return next(new AppError("You cannot post, no content", 400));

    const post = await UserPost.create({
      imageUrl: imageUrl,
      postText: text,
      isProfile: false,
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: {
        post,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const user = await User.findById(req.user.id);

    if (!user) next(new AppError("User not found", 404));

    if (!postId) return next(new AppError("Post ID is required", 400));

    const post = await UserPost.findById(postId).select("author");
    if (!post) return next(new AppError("Post not found", 404));
    if (post.author.toString() !== user._id.toString())
      return next(new AppError("Access denied", 403));

    const postToDelete = await UserPost.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.commentOnPost = async (req, res, next) => {
  try {
    const { comment, imageUrl } = req.body;
    const user = await User.findById(req.user.id);
    const postId = req.params.id;
    const io = req.app.get("io");
    const userSocketMap = req.app.get("userSocketMap");
    if (!user) return next(new AppError("User not found", 404));

    const post = await UserPost.findById(postId);

    if (!post) return next(new AppError("Post not found", 404));

    if (!comment && !imageUrl)
      return next(new AppError("You cannot leave comment field empty", 400));

    const userComment = await PostComment.create({
      post: postId,
      user: req.user.id,
      comment: comment,
    });

    res.status(201).json({
      success: true,
      message: "user comment created successfully",
      data: {
        userComment,
      },
    });

    // Emit the comment to the post's author
    const postAuthorSocketId = userSocketMap.get(post.author.toString());
    if (postAuthorSocketId) {
      io.to(postAuthorSocketId).emit("newComment", {
        postId: post._id,
        authorId: post.author,
        commenterId: req.user.id,
        comment: userComment,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getPostComment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const user = await User.findById(req.user.id);

    if (!user) return next(new AppError("User not found", 404));

    if (!postId) return next(new AppError("Post ID is needed", 400));

    const post = await UserPost.findById(postId)
      .populate("author", "firstname surname profilePics")
      .select("postText imageUrl createdAt content");

    if (!post) return next(new AppError("Post doesn't exist", 404));

    const postComment = await PostComment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("user", "firstname surname profilePics ");

    res.status(200).json({
      success: true,
      message: "success",
      data: {
        postComment,
        post,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.checkUserLastSeenStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('lastSeen');
    if (!user) return next(new AppError('User does not exist', 404));

    res.status(200).json({
      success: true,
      message: 'success',
      data: {
        user
      }
    })
  } catch (error) {
    next(error)
  }

}

exports.getAllRequests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return next(new AppError('User not found', 404));

    const requests = await SendRequest.find({ receiver: userId }).populate('sender', 'firstname surname profilePics');
    res.status(200).json({
      success: true,
      message: 'success',
      data: {
        requests
      }
    }) 
  } catch (error) {
    next(error);
  }
}

exports.getUserFriendStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(req.user.id);
     const userFriendStatus = await SendRequest.findOne({ sender: req.user.id, receiver: userId }).select('sender receiver status');
    if (!user) return next(new AppError('User not found', 404));
    if (!userId) return next(new AppError('Parameter is needed for this operation', 400));
    if (!userFriendStatus) return next(new AppError('Request not found', 404));
   
    res.status(200).json({
      success: true,
      message: "Success",
      data: {
        userFriendStatus
      }
    })
  } catch (err) {
    next(err)
  }

}