const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/login$', userController.handleLogin);

router.post('/signup$', userController.handleSignup);

router.post('/logout$', userController.handleLogout);

router.post("/forget", userController.forgetPassword);

router.post("/reset/:token", userController.resetPassword);

module.exports = router;