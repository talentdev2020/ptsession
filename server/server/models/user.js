const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    contactEmail: String,
    password: String,
    phone: String,
    role: Number,
    bio: String,
    avatar: String,
    contacts: {
      type: Object,
      default: {
        facebook: '',
        twitter: '',
        instagram: '',
      },
    },
    images: { type: Schema.Types.Array, default: [] },
    trainers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    invitedFrom: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
    invited: { type: Array, default: [] },
    address: { type: String, default: '' },
    location: { type: String, default: '' },
    sessionFeed: [{ type: Schema.Types.ObjectId, ref: 'Session' }],
    remainingSession: { type: Number, default: 0 },
    totalSessionCount: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
