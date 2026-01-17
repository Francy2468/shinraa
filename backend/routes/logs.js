const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const ExecutionLog = require('../models/ExecutionLog');
const Script = require('../models/Script');

const router = express.Router();

router.post('/record', authMiddleware, async (req, res) => {
  try {
    const {
      scriptId,
      executor,
      hwid,
      status = 'success',
      errorMessage,
      executionTime,
      memory
    } = req.body;
    
    const script = await Script.findById(scriptId);
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }

    if (hwid && script.hwids.length > 0 && !script.hwids.includes(hwid)) {
      const log = new ExecutionLog({
        scriptId,
        userId: req.userId,
        executor,
        hwid,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        status: 'blocked',
        errorMessage: 'HWID not whitelisted'
      });
      await log.save();
      return res.status(403).json({ error: 'HWID not whitelisted' });
    }

    if (executor === 'browser') {
      const log = new ExecutionLog({
        scriptId,
        userId: req.userId,
        executor: 'browser',
        status: 'blocked',
        errorMessage: 'Browser execution not allowed'
      });
      await log.save();
      return res.status(403).json({ error: 'Browser execution not allowed' });
    }

    const log = new ExecutionLog({
      scriptId,
      userId: req.userId,
      executor,
      hwid,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      status,
      errorMessage,
      executionTime,
      memory
    });
    
    await log.save();
    
    if (status === 'success') {
      script.executionCount += 1;
      await script.save();
    }
    
    res.json({ logged: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/execution-logs', authMiddleware, async (req, res) => {
  try {
    const logs = await ExecutionLog.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/script/:scriptId/logs', authMiddleware, async (req, res) => {
  try {
    const script = await Script.findOne({
      _id: req.params.scriptId,
      userId: req.userId
    });
    
    if (!script) {
      return res.status(404).json({ error: 'Script not found' });
    }
    
    const logs = await ExecutionLog.find({ scriptId: req.params.scriptId })
      .sort({ timestamp: -1 });
    
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
