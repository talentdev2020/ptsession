const express = require('express');
const { Session, Package, User } = require('../models');

const SESSION_TYPE = {
  PT: 1,
  NON_PT: 2,
  WEIGH_IN: 3,
  BODY_FAT: 4,
  PURCHASE: 5,
};

const addSession = async (req, res, next) => {
  console.log(req.body);
  const {
    notes,
    clientID,
    type,
    trainer,
    packageID,
    value,
    completed,
  } = req.body;
  try {
    const session = new Session({
      notes,
      type,
      trainer,
      packageID,
      value,
      completed,
    });
    session.save();

    const client = await User.findById(clientID);
    const sessionFeed = client.sessionFeed;
    const sessionData = { sessionFeed: sessionFeed.concat(session._id) };
    if (type === SESSION_TYPE.PT) {
      const remainingSession = client.remainingSession - 1;
      if (remainingSession < 0) {
        return res.json({
          error: true,
          msg: 'This user has no sessions available.',
        });
      }
      sessionData.remainingSession = remainingSession;
    }

    await User.updateOne(
      { _id: clientID },
      {
        $set: sessionData,
      },
      { upsert: true, useFindAndModify: false },
      (err, doc) => {
        if (err) {
          console.log(err);
        }
        console.log(doc);
      }
    );

    return res.json({
      error: false,
      msg: 'Added a session successfully.',
      data: await session.populate({ path: 'trainer' }).execPopulate(),
    });
  } catch (err) {
    return res.json({
      error: true,
    });
  }

  // const { packageID, sessionData } = req.body;
  // const session = new Session({ ...sessionData, packageID });
  // session.save();

  // const sessions = (await Package.findById(packageID)).sessions || [];
  // sessions.push(session._id);
  // await Package.updateOne(
  //   { _id: packageID },
  //   { $set: { sessions } },
  //   { upsert: true, useFindAndModify: false },
  //   (err, doc) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     console.log(doc);
  //   }
  // );

  // delete session['packageID'];
  // return res.json({
  //   error: false,
  //   msg: 'Session added successfully.',
  //   data: {
  //     _id: session._id,
  //     description: session.description,
  //   },
  // });
};

module.exports = {
  addSession,
};
