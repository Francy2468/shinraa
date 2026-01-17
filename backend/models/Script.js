const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  originalCode: { type: String, required: true },
  obfuscatedCode: { type: String },
  loaderCode: { type: String },
  status: { type: String, enum: ['draft', 'obfuscated', 'protected'], default: 'draft' },
  obfuscationLevel: { type: Number, min: 1, max: 5, default: 3 },
  fileSize: { type: Number },
  downloadCount: { type: Number, default: 0 },
  executionCount: { type: Number, default: 0 },
  hwids: [{ type: String }],
  antiTamper: { type: Boolean, default: true },
  antiDebug: { type: Boolean, default: true },
  personalVM: { type: Boolean, default: false },
  encryptionEnabled: { type: Boolean, default: true },
  providerType: { type: String, enum: ['none', 'linkvertise', 'workink', 'lootlabs'] },
  inviteLink: { type: String },
  watermark: { type: String, default: '-- Obfuscated with ShinraGuard' },
  metadata: {
    userAgent: String,
    ip: String,
    uploadedFrom: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Script', scriptSchema);
