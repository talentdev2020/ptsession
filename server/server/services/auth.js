const express = require('express');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const test = async (req, res, next) => {
  return res.json({ result: 'aaa' });
};

const { auth, store } = require('../helpers/firebase');
const { User } = require('../models');
const mongoose = require('mongoose');

const config = require('../config/env_config/config');
const { roles } = require('../config/options');

const getUserInfo = async (req, res, next) => {
  const { token } = req.body;
  console.log(req.body);

  try {
    console.log(token);
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    User.findById(id).exec((err, user) => {
      if (err) {
        console.log('err', err);
        throw err;
      }
      if (!user) {
        return res.json({
          error: true,
          msg: 'There is no user record corresponding to this identifier.',
        });
      }

      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 86400,
      });

      return res.json({
        token: token,
        error: false,
        authUser: user,
      });
    });
  } catch (err) {
    return res.json({
      error: 'true',
      msg: 'Invalid Token',
    });
  }
};

const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
    invited,
    trainerID,
  } = req.body;
  console.log('body', req.body);
  console.log('params', req.params);
  User.find({ email }).exec(async (err, users) => {
    if (err) {
      console.log('err', err);
      throw err;
    }
    console.log(users);
    if (users.length) {
      return res.json({
        error: true,
        msg: 'The email address is already in use by another account',
      });
    }
    const userData = { firstName, lastName, email, password, phone, role };

    if (role === roles.client) {
      userData.trainers = [];
      if (invited) {
        userData.trainers.push(trainerID);
      }
    }
    console.log('userData', userData);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      ...userData,
    });

    try {
      await user.save();

      sgMail.setApiKey(
        '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'
      );
      const msg = {
        to: email,
        from: 'hello@ptsession.com', // Use the email address or domain you verified above
        subject: 'Welcome to Ptsession',
        text: 'Welcome to Ptsession',
        html: `Hi ${firstName} ${lastName}, <br> <br> Thanks for using PTSession.`,
      };

      (async () => {
        try {
          await sgMail.send(msg);
        } catch (error) {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      })();

      return res.json({
        error: false,
        msg: 'User Registration Successful.',
      });
    } catch (err) {
      console.log('err', err);
      throw err;
    }
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let { email, password } = req.body;

  User.findOne({ email }).exec(async (err, user) => {
    if (err) {
      console.log('err', err);
      throw err;
    }
    if (!user) {
      return res.json({
        error: true,
        msg: 'There is no user record corresponding to this identifier.',
      });
    }

    if (user.password !== password) {
      return res.json({
        error: true,
        msg: 'There is no user record corresponding to this identifier.',
      });
    }

    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    if (req.body.firstLogin) {
      const date = new Date();
      console.log('date', user._id);
      await User.updateOne(
        { _id: user._id },
        { $set: { lastLogin: date } },
        { upsert: true, useFindAndModify: false, rawResult: true }
      );
    }

    return res.json({
      token: token,
      error: false,
      authUser: user,
    });
  });
};

module.exports = {
  register,
  login,
  getUserInfo,
  test,
};
