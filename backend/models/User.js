const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  googleId: { type: String },
  plan: { type: String, default: 'free', enum: ['free', 'starter', 'pro', 'elite'] },
  apiKey: { type: String, unique: true },
  hwid: { type: String },
  hwidBanned: { type: Boolean, default: false },
  obfuscationQuota: { type: Number, default: 10 },
  obfuscationUsed: { type: Number, default: 0 },
  scriptLimit: { type: Number, default: 5 },
  storageLimit: { type: Number, default: 104857600 },
  storageUsed: { type: Number, default: 0 },
  providers: {
    linkvertise: { enabled: false, key: '' },
    workink: { enabled: false, key: '' },
    lootlabs: { enabled: false, key: '' }
  },
  customization: {
    watermarkEnabled: true,
    watermarkText: 'Obfuscated with ShinraGuard',
    uiTheme: 'dark'
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  totalScriptsObfuscated: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcryptjs.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
