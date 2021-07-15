const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfileSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  trainers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  bio: String,
  avatar: String,
  contacts: Array,
});

const Profile = mongoose.model('Profile', ProfileSchema, 'profiles');

module.exports = Profile;
