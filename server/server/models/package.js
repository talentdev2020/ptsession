const mongoose = require('mongoose');
const { Schema } = mongoose;

const PackageSchema = new Schema(
  {
    trainerID: { type: Schema.Types.ObjectId, ref: 'User' },
    cost: Schema.Types.Number,
    name: Schema.Types.String,
    count: Schema.Types.Number,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Package = mongoose.model('Package', PackageSchema, 'packages');

module.exports = Package;
