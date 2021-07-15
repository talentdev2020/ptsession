const mongoose = require('mongoose');
const { Schema } = mongoose;

const SessionSchema = new Schema(
  {
    notes: Schema.Types.String,
    trainer: { type: Schema.Types.ObjectId, ref: 'User' },
    packageID: { type: Schema.Types.ObjectId, ref: 'Package' },
    type: { type: Schema.Types.Number },
    completed: { type: Schema.Types.Boolean, default: false },
    value: { type: Schema.Types.String, default: '' },
    removed: { type: Schema.Types.Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Session = mongoose.model('Session', SessionSchema, 'sessions');

module.exports = Session;
