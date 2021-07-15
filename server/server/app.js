const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');

module.exports = function () {
  let server = express(),
    create,
    start;

  create = (config, db) => {
    let routes = require('./routes');
    // set all the server things
    server.set('env', config.env);
    server.set('port', config.port);
    server.set('hostname', config.hostname);

    // add middleware to parse the json
    server.use('/public', express.static('public'));
    server.use(bodyParser.json());
    server.use(cors());
    server.use(
      bodyParser.urlencoded({
        extended: false,
      })
    );

    // Set up routes
    routes.init(server);
  };

  start = async () => {
    let hostname = server.get('hostname'),
      port = server.get('port');

    const mongoose = require('mongoose');
    try {
      await mongoose.connect('mongodb://157.245.95.145:27017/ptsession', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.log('MongoDB Connection Error: ', err);
    }

    server.listen(port, function () {
      console.log(
        'Express server listening on - http://' + hostname + ':' + port
      );
    });
  };
  return {
    create: create,
    start: start,
  };
};
