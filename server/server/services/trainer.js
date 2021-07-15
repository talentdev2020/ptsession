const express = require('express');
const sgMail = require('@sendgrid/mail');
const { store } = require('../helpers/firebase');
const { User, Package } = require('../models');
const { roles } = require('../config/options');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const multer = require('multer');
const appUrl = process.env.APP_URL;

const getClient = async (req, res, next) => {};

const getClientList = async (req, res, next) => {
  const { trainerID } = req.params;
  try {
    let allClients = await User.find({ role: roles.client });
    clients = allClients.filter((client) => {
      if (client.trainers) {
        return client.trainers.includes(trainerID);
      }
      return false;
    });
    return res.json({ allClients, clients });
  } catch (err) {
    console.log('err', err);
  }
};

const sendInvite = async (req, res, next) => {
  const { email, trainerID, _id, firstName, lastName } = req.body;
  const registerUrl = _id
    ? `client/invite?clientID=${_id}&trainerID=${trainerID}`
    : `user/register?email=${email}&trainerID=${trainerID}`;

  sgMail.setApiKey(
    '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'
  );
  const trainer = await User.findById(trainerID);
  const trainerName = `${trainer.firstName} ${trainer.lastName}`;
  const msg = {
    to: email,
    from: 'hello@ptsession.com', // Use the email address or domain you verified above
    subject: 'Invitation from PTSession',
    text: 'Please join Ptsession using the link below.',
    html: `You are invited to Ptsession from ${trainerName}. <br> Please use the link below to join. <br> <a href=${appUrl}${registerUrl}>Accept Invitation</a>`,
  };

  if (email === trainer.email) {
    return res.json({
      error: true,
      msg: 'A user with this email already exists.',
    });
  }

  if ((await User.find({ email })).length && !_id) {
    return res.json({
      error: true,
      msg: 'A user with this email already exists.',
    });
  }

  //ES8
  (async () => {
    try {
      await sgMail.send(msg);
      if (_id) {
        const client = await User.findById(_id);
        const invitedFrom = client.invitedFrom || [];
        console.log(invitedFrom);
        console.log(invitedFrom.includes(trainerID));
        if (!invitedFrom.includes(trainerID)) {
          invitedFrom.push(trainerID);
        }

        User.updateOne(
          { _id },
          { $set: { invitedFrom: invitedFrom } },
          { upsert: true, useFindAndModify: false },
          (err, doc) => {
            if (err) {
              console.log(err);
            }
            console.log(doc);
          }
        );
      } else {
        const trainer = await User.findById(trainerID);
        const invited = trainer.invited;
        if (!invited.includes(email)) {
          invited.push(email);
        }
        User.updateOne(
          { _id: trainerID },
          { $set: { invited: invited } },
          { upsert: true, useFindAndModify: false },
          (err, doc) => {
            if (err) {
              console.log(err);
            }
            console.log(doc);
          }
        );
      }
      return res.json({
        error: false,
        msg: 'Invitation sent successfully!',
      });
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
      return res.json({
        error: true,
        msg: 'Invitation failed. Try again.',
      });
    }
  })();
};

const acceptInvite = async (req, res, next) => {
  console.log(req.body);
  const { clientID, trainerID } = req.body;
  const client = await User.findById(clientID);
  if (!client) {
    return res.json({
      error: true,
      msg: 'Invalid Invitation Link.',
    });
  }
  const invitedFrom = client.invitedFrom;
  console.log('invitedFrom', invitedFrom);
  if (invitedFrom.includes(trainerID)) {
    const trainers = client.trainers || [];
    console.log('trainers', trainers);
    if (!trainers.includes(trainerID)) {
      trainers.push(trainerID);
    }

    invitedFrom.splice(invitedFrom.indexOf(trainerID), 1);

    User.updateOne(
      { _id: clientID },
      { $set: { invitedFrom, trainers } },
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
      msg: 'Great. You accepted the invitation.',
    });
  } else {
    return res.json({
      error: true,
      msg: 'Invalid Invitation Link.',
    });
  }
};

const getAllSessions = async (req, res, next) => {
  const { clientID } = req.params;
  try {
    const client = await (await User.findById(clientID))
      .populate({
        path: 'sessionFeed',
      })
      .execPopulate();
    await Promise.all(
      (client.sessionFeed = client.sessionFeed.map(async (session) => {
        const temp = await session
          .populate({
            path: 'trainerID',
          })
          .execPopulate();
        return temp;
      }))
    );
    return res.json({
      error: false,
      msg: 'Fetched successfully.',
      data: trainer.packages,
    });
  } catch (err) {
    return res.json({
      error: true,
      msg: 'Fetch failed.',
      data: [],
    });
  }
};

const getAllPackages = async (req, res, next) => {
  const { trainerID } = req.params;
  try {
    const trainer = await (await User.findById(trainerID))
      .populate({
        path: 'packages',
      })
      .execPopulate();
    await Promise.all(
      (trainer.packages = trainer.packages.map(async (packageItem) => {
        const temp = await packageItem
          .populate({
            path: 'trainerID',
          })
          .populate({
            path: 'sessions',
          })
          .execPopulate();
        return temp;
      }))
    );
    return res.json({
      error: false,
      msg: 'Fetched successfully.',
      data: trainer.packages,
    });
  } catch (err) {
    return res.json({
      error: true,
      msg: 'Fetch failed.',
      data: [],
    });
  }
};

const addPackage = async (req, res, next) => {
  console.log('body', req.body);
  const { trainerID, packageData } = req.body;
  const package = new Package({ ...packageData, trainerID });
  package.save();

  const packages = (await User.findById(trainerID)).packages || [];
  packages.push(package._id);
  await User.updateOne(
    { _id: trainerID },
    { $set: { packages } },
    { upsert: true, useFindAndModify: false },
    (err, doc) => {
      if (err) {
        console.log(err);
      }
      console.log(doc);
    }
  );

  delete package['trainerID'];
  console.log('package', package);
  return res.json({
    error: false,
    msg: 'Package added successfully.',
    data: {
      _id: package._id,
      name: package.name,
      cost: package.cost,
      count: package.count,
    },
  });
};

const updatePackage = async (req, res, next) => {
  console.log('body', req.body);
  const { editItem } = req.body;
  await Package.updateOne(
    { _id: editItem._id },
    {
      $set: { name: editItem.name, cost: editItem.cost, count: editItem.count },
    },
    { upsert: true, useFindAndModify: false },
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.json({
          error: false,
          msg: 'Package update failed.',
        });
      }
      return res.json({
        error: false,
        msg: 'Package updated successfully.',
      });
    }
  );
};

const removePackage = async (req, res, next) => {
  const { packageID } = req.params;
  Package.findByIdAndRemove(
    packageID,
    { useFindAndModify: false },
    async (err, data) => {
      let { packages } = await User.findById(data.trainerID);
      packages = packages.filter((packageItem) => packageItem._id != packageID);
      console.log('packageID', packageID);
      console.log('packages', packages);
      await User.updateOne(
        { _id: data.trainerID },
        { $set: { packages } },
        { upsert: true, useFindAndModify: false }
      );
      return res.json({
        error: false,
        msg: 'Package deleted successfully.',
      });
    }
  );
};

const purchasePackage = async (req, res, next) => {
  console.log(req.body);
  const { packageID, clientID } = req.body;
  let client = await User.findById(clientID);
  const package = await Package.findById(packageID);
  let { remainingSession, totalSessionCount } = client;
  remainingSession += package.count;
  totalSessionCount += package.count;
  const newPackages = client.packages.concat(packageID);

  await User.updateOne(
    {
      _id: clientID,
    },
    { $set: { packages: newPackages, remainingSession, totalSessionCount } },
    { upsert: true, useFindAndModify: false }
  );
  client = await (await User.findById(clientID))
    .populate({
      path: 'packages',
    })
    .execPopulate();

  await Promise.all(
    (client.packages = client.packages.map(async (packageItem) => {
      const temp = await packageItem
        .populate({
          path: 'trainerID',
        })
        .populate({
          path: 'sessions',
        })
        .execPopulate();
      return temp;
    }))
  );
  console.log(client);
  return res.json({
    error: false,
    data: {},
  });
};

module.exports = {
  getClient,
  sendInvite,
  acceptInvite,
  getClientList,
  getAllSessions,
  getAllPackages,
  addPackage,
  updatePackage,
  removePackage,
  purchasePackage,
};
