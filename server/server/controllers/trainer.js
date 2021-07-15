const express = require('express');
const multer = require('multer');
const trainerService = require('../services/trainer');
const authClientRequest = require('../middlewares/authGaurd');
const uuidv4 = require('uuid').v4;
let router = express.Router();
const { User } = require('../models');

router.post(
  '/sendInvite',
  authClientRequest.authClientToken,
  trainerService.sendInvite
);

router.post(
  '/acceptInvite',
  authClientRequest.authClientToken,
  trainerService.acceptInvite
);

router.get(
  '/getClientList/:trainerID',
  authClientRequest.authClientToken,
  trainerService.getClientList
);

router.get(
  '/packages/:trainerID',
  authClientRequest.authClientToken,
  trainerService.getAllPackages
);

router.get(
  '/sessions/:clientID',
  authClientRequest.authClientToken,
  trainerService.getAllSessions
);

router.post(
  '/addPackage',
  authClientRequest.authClientToken,
  trainerService.addPackage
);

router.post(
  '/updatePackage',
  authClientRequest.authClientToken,
  trainerService.updatePackage
);

router.post(
  '/purchasePackage',
  authClientRequest.authClientToken,
  trainerService.purchasePackage
);

router.delete(
  '/removePackage/:packageID',
  authClientRequest.authClientToken,
  trainerService.removePackage
);

const DIR = './public/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, uuidv4() + '-' + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

router.post(
  '/upload-images',
  upload.array('imgCollection'),
  authClientRequest.authClientToken,
  async (req, res, next) => {
    const { trainerID } = req.body;
    console.log('trainerID', trainerID);
    const reqFiles = [];
    const url = req.protocol + '://' + req.get('host');
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + '/public/' + req.files[i].filename);
    }

    const user = await User.findById(trainerID);

    await User.updateOne(
      { _id: trainerID },
      { $set: { images: reqFiles.concat(user.images) } },
      { upsert: true, useFindAndModify: false }
    );

    return res.json({
      error: false,
      data: reqFiles.concat(user.images),
    });
  }
);

module.exports = router;
