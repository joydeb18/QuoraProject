const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/', require('./routes/authRoutes'));

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));