const express = require('express');
const clientService = require('../services/client');
const authClientRequest = require('../middlewares/authGaurd');
let router = express.Router();

module.exports = router;
