// Hinglish: Ye Mongoose schema User collection ka structure define karta hai.
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    }, // Hinglish: naam required
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    }, // Hinglish: email unique
    passwordHash: {
      type: String,
      required: true
    }, // Hinglish: password ko hash karke store karenge
  },
  { timestamps: true } // Hinglish: createdAt, updatedAt auto ban jayega
);

module.exports = mongoose.model("User", userSchema);