const express = require('express');

const userController = require('../../controllers/user');
const authController = require('../../controllers/auth');
const trainerController = require('../../controllers/trainer');
const sessionController = require('../../controllers/session');

let router = express.Router();
router.use('/user', userController);
router.use('/auth', authController);
router.use('/trainer', trainerController);
router.use('/session', sessionController);
module.exports = router;
