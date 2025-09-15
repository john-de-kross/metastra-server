const express = require('express');

const router = express.Router();

const { createUser } = require('../CONTROLLERS/registrationController');
const { sendOtp, otpVerification } = require('../CONTROLLERS/otpController');
const { loginUser, logOutUser } = require('../CONTROLLERS/loginController');
const { changePassword } = require('../CONTROLLERS/forgetPassController');
const { checkAuth } = require('../CONTROLLERS/checkAuth');
const otpLimitRate = require('../MIDDLEWARE/limitRate');
const {
    getUserProfile,
    createAboutUser,
    aboutProfile,
    suggestedUsers,
    viewUserProfile,
    createPost,
    deletePost,
    commentOnPost,
    getPostComment,
    checkUserLastSeenStatus,
    getAllRequests,
    getUserFriendStatus,
    acceptOrRejectRequest,
    getAllFriends,
    sendMessage
} = require('../CONTROLLERS/profileController');
const { protect } = require('../MIDDLEWARE/protect');
const { profilePicsUpdate } = require('../CONTROLLERS/profilePicsController');
const { uploadCoverPics } = require('../CONTROLLERS/coverPicsController');
const { createRequest} = require('../CONTROLLERS/createFriendRequest')


router.post('/register', createUser); 
router.post('/otp', otpLimitRate, sendOtp);
router.post('/verify', otpVerification); 
router.post('/login', loginUser, otpLimitRate); 
router.get('/check-auth', checkAuth);
router.post('/change-password', changePassword);
router.get('/user-profile', protect, getUserProfile);
router.put('/update-profile-pic', protect, profilePicsUpdate); 
router.put('/update-cover-pic', protect, uploadCoverPics);
router.post('/create-about-profile', protect, createAboutUser);
router.get('/about-user', protect, aboutProfile)
router.get('/suggested-users', protect, suggestedUsers);
router.get('/view-user-profile/:id', protect, viewUserProfile);
router.post('/post-content', protect, createPost);
router.delete('/delete-post/:id', protect, deletePost);
router.post('/comment-on-post/:id', protect, commentOnPost);
router.get('/get-comments/:id', protect, getPostComment);
router.post('/create-friend-request', protect, createRequest);
router.get('/check-user-last-seen/:userId', protect, checkUserLastSeenStatus);
router.get('/get-all-requests', protect, getAllRequests)
router.post('/logout', protect, logOutUser);
router.get('/get-friend-status/:userId', protect, getUserFriendStatus);
router.post('/accept-reject-request', protect, acceptOrRejectRequest);
router.get('/get-all-friends/:userId', protect, getAllFriends);
router.post('/message', protect, sendMessage)
module.exports = router;
