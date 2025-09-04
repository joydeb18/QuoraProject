// Hinglish: Ye file sirf database se connect hone ka kaam karti hai.
const mongoose = require("mongoose");
require("dotenv").config(); // .env file se variables load karne ke liye

// Hinglish: Compass me ye DB naam (signupDB) automatic create ho jayega jab hum data save karenge.
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected (Local Compass)");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Hinglish: fatal error to app band kar do
  }
}

module.exports = connectDB;