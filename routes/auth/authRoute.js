const express = require('express');
const authRouter = express();
const authController = require('../../controllers/auth/authController');

// authRouter.post('/sendOtp', authController.sendOtp);
// authRouter.post('/verifyOtp', authController.verifyOtp);
// authRouter.get('/profile', verifyUser, authController.getProfile);
// authRouter.patch('/profile', verifyUser, authController.updateProfile);
authRouter.post('/userLogin', authController.userLogin);
authRouter.post('/userRegistration', authController.userRegistration);


module.exports = authRouter;