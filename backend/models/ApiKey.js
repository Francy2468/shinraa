const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const apiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, default: () => uuidv4(), unique: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  rateLimit: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);
