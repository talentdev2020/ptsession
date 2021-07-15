const express = require('express');
const userService = require('../services/user');
const authClientRequest = require('../middlewares/authGaurd');
const user = require('../services/user');
let router = express.Router();

router.get('/:userId', (req, res, next) => next(), userService.getUserDetails);

router.get(
  '/getSessionFeed/:userId',
  authClientRequest.authClientToken,
  userService.getSessionFeed
);

router.post(
  '/updateProfile',
  authClientRequest.authClientToken,
  userService.updateProfile
);

router.get(
  '/completeSession/:sessionId',
  authClientRequest.authClientToken,
  userService.completeSession
);

router.post(
  '/updateSessionFeed',
  authClientRequest.authClientToken,
  userService.updateSessionFeed
);

router.get(
  '/removeSessionFeed/:sessionId',
  authClientRequest.authClientToken,
  user.removeSessionFeed
);

router.get(
  '/deleteSessionFeed/:sessionId',
  authClientRequest.authClientToken,
  user.deleteSessionFeed
);

module.exports = router;
