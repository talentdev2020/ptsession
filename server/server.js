const server = require('./server/app')();
const config = require('./server/config/env_config/config');

require('dotenv').config();

//create the basic server setup
server.create(config);

//start the server
server.start();
