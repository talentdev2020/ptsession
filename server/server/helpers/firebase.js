const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
require('firebase/firestore');
require('firebase/functions');
require('firebase/storage');
const firebaseConfig = require('../config/env_config/firebase');

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const store = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();
const functions = firebase.functions();

module.exports = { auth, database, store, storage, functions };
