const express = require('express');
const { User } = require('../models');
const { roles } = require('../config/options');
const appUrl = process.env.APP_URL;

const getClient = async (req, res, next) => {
  const { clientID } = req.params;
};

module.exports = {
  getClient,
};
