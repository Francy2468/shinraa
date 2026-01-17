const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const ApiKey = require('../models/ApiKey');

const router = express.Router();

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Key name is required' });
    }
    
    const apiKey = new ApiKey({
      userId: req.userId,
      name,
      key: uuidv4()
    });
    
    await apiKey.save();
    
    res.json({
      message: 'API key generated successfully',
      key: apiKey.key,
      name: apiKey.name,
      createdAt: apiKey.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/list', authMiddleware, async (req, res) => {
  try {
    const keys = await ApiKey.find({ userId: req.userId }).select('-key');
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:keyId', authMiddleware, async (req, res) => {
  try {
    const apiKey = await ApiKey.findOneAndDelete({
      _id: req.params.keyId,
      userId: req.userId
    });
    
    if (!apiKey) {
      return res.status(404).json({ error: 'Key not found' });
    }
    
    res.json({ message: 'API key deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
