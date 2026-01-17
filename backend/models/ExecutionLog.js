const mongoose = require('mongoose');

const executionLogSchema = new mongoose.Schema({
  scriptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Script', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  executor: { type: String, enum: ['roblox', 'browser', 'unknown'], default: 'unknown' },
  hwid: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  status: { type: String, enum: ['success', 'blocked', 'failed'], default: 'success' },
  errorMessage: { type: String },
  executionTime: { type: Number },
  memory: { type: Number },
  additionalData: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExecutionLog', executionLogSchema);
