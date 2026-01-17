const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    obfuscationQuota: 10,
    obfuscationPerMonth: 10,
    scriptLimit: 5,
    storageLimit: 104857600,
    features: ['Basic obfuscation', 'Anti-debug', 'Execution logs']
  },
  starter: {
    name: 'Starter',
    price: 5,
    obfuscationQuota: 50,
    obfuscationPerMonth: 50,
    scriptLimit: 50,
    storageLimit: 1073741824,
    features: ['Advanced obfuscation', 'Anti-debug', 'Anti-tamper', 'Execution logs', '1 Provider']
  },
  pro: {
    name: 'Pro',
    price: 15,
    obfuscationQuota: 150,
    obfuscationPerMonth: 150,
    scriptLimit: 200,
    storageLimit: 5368709120,
    features: ['Maximum obfuscation', 'Anti-debug', 'Anti-tamper', 'Personal VM', 'Execution logs', '3 Providers', 'Priority support']
  },
  elite: {
    name: 'Elite',
    price: 30,
    obfuscationQuota: 500,
    obfuscationPerMonth: 500,
    scriptLimit: 1000,
    storageLimit: 10737418240,
    features: ['Maximum obfuscation', 'All features', 'Custom watermark', 'HWID ban system', 'All providers', '24/7 support', 'Custom VM']
  }
};

router.get('/list', (req, res) => {
  res.json(PLANS);
});

router.get('/current', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const plan = PLANS[user.plan];
    
    res.json({
      currentPlan: user.plan,
      planDetails: plan,
      usage: {
        obfuscation: user.obfuscationUsed,
        quota: user.obfuscationQuota,
        storage: user.storageUsed,
        storageLimit: user.storageLimit,
        scripts: await require('../models/Script').countDocuments({ userId: req.userId }),
        scriptLimit: user.scriptLimit
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upgrade', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const user = await User.findById(req.userId);
    user.plan = plan;
    user.obfuscationQuota = PLANS[plan].obfuscationQuota;
    user.scriptLimit = PLANS[plan].scriptLimit;
    user.storageLimit = PLANS[plan].storageLimit;
    user.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    await user.save();
    
    res.json({ message: 'Plan upgraded successfully', plan: user.plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
