const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const ALLOWED_ORIGINS = [
  process.env.FRONTEND_ORIGIN || 'https://quora-project-frontend.vercel.app',
  'http://localhost:3000' // For local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/', require('./routes/authRoutes')); 
app.use('/api/users', require('./routes/userRoutes'));
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/posts', postRoutes);
app.use('/api/post', postRoutes);
app.use('/api/categories', categoryRoutes);

// Compatibility mounts (in case frontend calls without /api prefix)
app.use('/posts', postRoutes);
app.use('/post', postRoutes);
app.use('/categories', categoryRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));