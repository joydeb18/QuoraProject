// Hinglish: Ye file sirf database se connect hone ka kaam karti hai.

const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/signupDB"; 
// Hinglish: Compass me ye DB naam (signupDB) automatic create ho jayega jab hum data save karenge.

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
