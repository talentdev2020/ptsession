const express = require('express');
const { User, Session } = require('../models');
const SESSION_TYPE = {
  PT: 1,
  NON_PT: 2,
  WEIGH_IN: 3,
  BODY_FAT: 4,
  PURCHASE: 5,
};

const updateProfile = async (req, res, next) => {
  const { id, data } = req.body;

  try {
    await User.updateOne(
      { _id: id },
      { $set: { ...data } },
      { upsert: true, useFindAndModify: false, new: true, rawResult: true }
    );
    const user = await (
      await User.findById(id)
        .populate({
          path: 'trainers',
          select: ['firstName', 'lastName', 'packages', 'contacts'],
        })
        .populate({
          path: 'packages',
          select: ['_id', 'name', 'cost', 'count'],
        })
    ).execPopulate();
    await Promise.all(
      user.trainers.map(async (trainer) => {
        const temp = await trainer
          .populate({
            path: 'packages',
            select: ['_id', 'name', 'cost', 'count'],
          })
          .execPopulate();
        return temp;
      })
    );
    return res.json({
      error: false,
      data: { ...user._doc, trainersData: [] },
    });
  } catch (err) {
    console.log('err', err);
  }
};

const getUserDetails = async (req, res, next) => {
  const { userId } = req.params;
  const user = await (await User.findById(userId))
    .populate({
      path: 'trainers',
      select: [
        'firstName',
        'lastName',
        'packages',
        'contacts',
        'email',
        'phone',
      ],
    })
    .populate({
      path: 'packages',
      select: ['_id', 'name', 'cost', 'count'],
    })
    .populate({
      path: 'sessionFeed',
    })
    .execPopulate();
  await Promise.all(
    user.trainers.map(async (trainer) => {
      const temp = await trainer
        .populate({
          path: 'packages',
          select: ['_id', 'name', 'cost', 'count'],
        })
        .execPopulate();
      return temp;
    })
  );
  await Promise.all(
    (user.trainer = user.sessionFeed.map(async (session) => {
      const temp = await session
        .populate({
          path: 'trainer',
          select: ['_id', 'firstName', 'lastName', 'created_at', 'updated_at'],
        })
        .execPopulate();
      return temp;
    }))
  );
  return res.json({
    msg: 'User Fetched Successfully',
    error: false,
    data: { ...user._doc, trainersData: [] },
  });
};

const getSessionFeed = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await (await User.findById(userId))
      .populate({
        path: 'sessionFeed',
        options: { sort: { updated_at: -1 } },
      })
      .populate({
        path: 'packages',
      })
      .execPopulate();
    await Promise.all(
      (user.trainer = user.sessionFeed.map(async (session) => {
        const temp = await session
          .populate({
            path: 'trainer',
            select: [
              '_id',
              'firstName',
              'lastName',
              'created_at',
              'updated_at',
            ],
          })
          .execPopulate();
        return temp;
      }))
    );
    return res.json({
      msg: 'Session Feed Fetched Successfully',
      error: false,
      data: user._doc,
    });
  } catch (err) {
    return res.json({
      msg: 'Session Feed Fetch Failed.',
      error: true,
    });
  }
};

const updateSessionFeed = async (req, res, next) => {
  const { sessionData } = req.body;
  try {
    await Session.updateOne(
      { _id: sessionData._id },
      { $set: { notes: sessionData.notes, value: sessionData.value } },
      { upsert: true, useFindAndModify: false, new: true, rawResult: true }
    );
    return res.json({
      error: false,
    });
  } catch (err) {
    return res.json({
      error: true,
      msg: error.response,
    });
  }
};

const removeSessionFeed = async (req, res, next) => {
  const { sessionId } = req.params;
  try {
    await Session.updateOne(
      { _id: sessionId },
      { $set: { removed: true } },
      { upsert: true, useFindAndModify: false, new: true, rawResult: true }
    );
    return res.json({
      error: false,
    });
  } catch (err) {
    console.log('err', err);
    return res.json({
      error: true,
    });
  }
};

const deleteSessionFeed = async (req, res, next) => {
  const { sessionId } = req.params;
  Session.findByIdAndRemove(
    sessionId,
    { useFindAndModify: false },
    async (err, data) => {
      if (!err) {
        return res.json({
          error: false,
        });
      } else {
        return res.json({
          error: true,
        });
      }
    }
  );
};

const completeSession = async (req, res, next) => {
  const { sessionId } = req.params;
  try {
    await Session.updateOne(
      { _id: sessionId },
      { $set: { completed: true } },
      { upsert: true, useFindAndModify: false, new: true, rawResult: true }
    );
    return res.json({
      error: false,
    });
  } catch (err) {
    console.log('err', err);
    return res.json({
      error: true,
    });
  }
};

module.exports = {
  getUserDetails,
  updateProfile,
  getSessionFeed,
  completeSession,
  updateSessionFeed,
  removeSessionFeed,
  deleteSessionFeed,
};
