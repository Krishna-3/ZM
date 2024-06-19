const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/login$', userController.handleLogin);

router.post('/signup$', userController.handleSignup);

router.post('/logout$', userController.handleLogout);

module.exports = router;