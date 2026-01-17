const express = require('express');
const crypto = require('crypto');
const { authMiddleware } = require('../middleware/auth');
const Script = require('../models/Script');
const User = require('../models/User');
const ObfuscatorEngine = require('../obfuscator/engine');

const router = express.Router();

const obfuscator = new ObfuscatorEngine();

router.post('/obfuscate', authMiddleware, async (req, res) => {
  try {
    const { code, name, obfuscationLevel = 3, providers = 'none' } = req.body;
    
    if (!code || !name) {
      return res.status(400).json({ error: 'Code and name are required' });
    }
    
    const user = await User.findById(req.userId);
    
    if (user.hwidBanned) {
      return res.status(403).json({ error: 'Your account is HWID banned' });
    }
    
    if (user.plan === 'free' && user.obfuscationUsed >= user.obfuscationQuota) {
      return res.status(403).json({ error: 'Obfuscation quota exceeded. Upgrade your plan.' });
    }
    
    const obfuscatedCode = obfuscator.obfuscate(code, {
      level: Math.min(obfuscationLevel, 5),
      stringEncryption: true,
      variableRenaming: true,
      antiDebug: true,
      antiTamper: true,
      watermark: user.customization.watermarkText
    });
    
    const loaderCode = obfuscator.generateLoader(obfuscatedCode, {
      blockBrowser: true,
      onlyRobloxExecutor: true,
      encryption: 'AES-256'
    });
    
    const script = new Script({
      userId: req.userId,
      name,
      originalCode: code,
      obfuscatedCode: obfuscatedCode.code,
      loaderCode: loaderCode,
      status: 'protected',
      obfuscationLevel,
      fileSize: obfuscatedCode.code.length,
      antiTamper: true,
      antiDebug: true,
      personalVM: obfuscationLevel >= 4,
      encryptionEnabled: true,
      watermark: user.customization.watermarkText,
      metadata: {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        uploadedFrom: 'dashboard'
      }
    });
    
    await script.save();
    
    user.obfuscationUsed += 1;
    user.totalScriptsObfuscated += 1;
    user.storageUsed += obfuscatedCode.code.length;
    await user.save();
    
    res.json({
      success: true,
      script: {
        id: script._id,
        name: script.name,
        loaderCode: loaderCode,
        obfuscatedCode: obfuscatedCode.code,
        obfuscationLevel,
        status: 'protected'
      },
      stats: {
        compressionRatio: ((1 - obfuscatedCode.code.length / code.length) * 100).toFixed(2) + '%',
        originalSize: code.length,
        obfuscatedSize: obfuscatedCode.code.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/preview/:scriptId', authMiddleware, async (req, res) => {
  try {
    const script = await Script.findOne({
      _id: req.params.scriptId,
      userId: req.userId
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    res.json({
      obfuscatedCode: script.obfuscatedCode,
      loaderCode: script.loaderCode,
      obfuscationLevel: script.obfuscationLevel
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
