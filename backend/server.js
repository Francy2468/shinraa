const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shinraguard')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ShinraGuard Backend Running', timestamp: new Date() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/obfuscate', require('./routes/obfuscate'));
app.use('/api/scripts', require('./routes/scripts'));
app.use('/api/keys', require('./routes/keys'));
app.use('/api/users', require('./routes/users'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/plans', require('./routes/plans'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`ShinraGuard Backend running on port ${PORT}`);
});
