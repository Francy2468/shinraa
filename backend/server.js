const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ].filter(Boolean),
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shinraguard';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

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
