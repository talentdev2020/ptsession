const express = require('express');
const authService = require('../services/auth');
const validation = require('../middlewares/validation');
let router = express.Router();

router.get('/test', validation.validateRegistrationBody(), authService.test);

router.post(
  '/register',
  validation.validateRegistrationBody(),
  authService.register
);

router.post('/login', validation.validateLoginBody(), authService.login);
router.post(
  '/getUserInfo',
  validation.validateLoginBody(),
  authService.getUserInfo
);

module.exports = router;
