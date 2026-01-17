const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, email, customization } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (customization) {
      user.customization = { ...user.customization, ...customization };
    }
    
    await user.save();
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/set-hwid', authMiddleware, async (req, res) => {
  try {
    const { hwid } = req.body;
    
    if (!hwid) {
      return res.status(400).json({ error: 'HWID is required' });
    }
    
    const user = await User.findById(req.userId);
    user.hwid = hwid;
    await user.save();
    
    res.json({ message: 'HWID set successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ban-hwid/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.userId.toString() !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Only admins can ban HWIDs' });
    }
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.hwidBanned = true;
    await user.save();
    
    res.json({ message: 'User HWID banned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update-providers', authMiddleware, async (req, res) => {
  try {
    const { provider, key } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (user.providers[provider]) {
      user.providers[provider].key = key;
      user.providers[provider].enabled = true;
      await user.save();
      
      res.json({ message: `${provider} provider configured successfully` });
    } else {
      res.status(400).json({ error: 'Invalid provider' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
