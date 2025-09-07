const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Aapke auth controller ko yahan import karne ki zaroorat nahi hai
// const authController = require('./controllers/authController');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// API Routes
app.use('/', require('./routes/authRoutes')); // Login/Signup ke liye (Aapne /api/auth use nahi kiya tha)
app.use('/api/users', require('./routes/userRoutes')); // User management ke liye

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));