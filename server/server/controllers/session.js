const express = require('express');
const sessionService = require('../services/session');
const authClientRequest = require('../middlewares/authGaurd');
let router = express.Router();

router.post(
  '/addSession',
  authClientRequest.authClientToken,
  sessionService.addSession
);

module.exports = router;
