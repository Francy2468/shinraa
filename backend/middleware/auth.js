const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'No API key provided' });
  }
  
  const ApiKey = require('../models/ApiKey');
  ApiKey.findOne({ key: apiKey, active: true }).populate('userId').then(record => {
    if (!record) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    req.userId = record.userId._id;
    req.user = record.userId;
    next();
  }).catch(err => res.status(500).json({ error: err.message }));
};

module.exports = { authMiddleware, apiKeyMiddleware };
