const express = require('express');

const router = express.Router();

const { createUser } = require('../CONTROLLERS/registrationController');

router.post('/register', createUser);

module.exports = router;