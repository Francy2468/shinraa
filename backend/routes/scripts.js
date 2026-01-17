const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const Script = require('../models/Script');

const router = express.Router();

router.get('/list', authMiddleware, async (req, res) => {
  try {
    const scripts = await Script.find({ userId: req.userId }).select('-obfuscatedCode -loaderCode');
    res.json(scripts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:scriptId', authMiddleware, async (req, res) => {
  try {
    const script = await Script.findOne({
      _id: req.params.scriptId,
      userId: req.userId
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    res.json(script);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:scriptId', authMiddleware, async (req, res) => {
  try {
    const script = await Script.findOneAndDelete({
      _id: req.params.scriptId,
      userId: req.userId
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    res.json({ message: 'Script deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:scriptId/download', authMiddleware, async (req, res) => {
  try {
    const script = await Script.findOne({
      _id: req.params.scriptId,
      userId: req.userId
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    script.downloadCount += 1;
    await script.save();
    
    const filename = `${script.name.replace(/[^a-z0-9]/gi, '_')}.lua`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(script.loaderCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
