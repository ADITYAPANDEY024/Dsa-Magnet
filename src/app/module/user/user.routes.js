const express = require('express');
const userController = require('./user.controller')


const router = express.Router();

router.post('/createUser', userController.createUserController);
router.post('/socialmedialogin', userController.signupViaSocialMediaController)
module.exports = router;