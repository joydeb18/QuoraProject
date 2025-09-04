// config/db.js

// Hinglish: Hum 'mongoose' tool ko la rahe hain, jo kitchen ke appliances (DB) se communicate karne mein expert hai.
const mongoose = require("mongoose");
// '.env' file se connection ka secret address la rahe hain.
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

// Hinglish: Yeh connection jodne ka process hai.
async function connectDB() {
  try {
    // Hum mongoose se keh rahe hain ki is address par jakar connection jodo.
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected (Local Compass)");
  } catch (err) {
    // Agar connection nahi juda (e.g., power cut), to error dikhao.
    console.error("❌ MongoDB Connection Error:", err.message);
    // Aur restaurant ko band kar do, kyunki bina kitchen ke restaurant nahi chal sakta.
    process.exit(1); 
  }
}

// Hinglish: Is function ko dusri files mein use karne ke liye export kar rahe hain.
module.exports = connectDB;