const express = require('express');
const userRouter = express();
const userController = require('../../controllers/user/userController');
const { verifyUser } = require('../../middleware/auth');

userRouter.get('/dummyUserRegistration', userController.dummyUserRegistration);
userRouter.get('/dummyUserContacts', userController.dummyUserContacts);
userRouter.put('/markNumberSpam/:id', verifyUser, userController.markNumberSpam);
userRouter.post('/searchPersonByName', verifyUser, userController.searchPersonByName);
userRouter.post('/searchByContactNumber', verifyUser, userController.searchByContactNumber);
userRouter.post('/getContactDetail/:contactId', verifyUser, userController.getContactDetail);


module.exports = userRouter;