const express = require('express');

const router = express.Router();

const { createUser } = require('../CONTROLLERS/registrationController');
const { sendOtp } = require('../CONTROLLERS/otpController');

router.post('/register', createUser);
router.post('/otp', sendOtp);

module.exports = router;