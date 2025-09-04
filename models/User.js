// models/User.js

const mongoose = require("mongoose");

// Hinglish: Hum yahan 'User' dish ki recipe (Schema) likh rahe hain.
const userSchema = new mongoose.Schema(
  {
    // Ingredient 1: username, jo text (String) hona chahiye aur zaroori (required) hai.
    username: {
      type: String,
      required: true,
    },
    // Ingredient 2: email, jo text ho, zaroori ho, aur har dish ke liye unique ho.
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Ingredient 3: passwordHash, jo text ho aur zaroori ho.
    passwordHash: {
      type: String,
      required: true,
    },
  },
  // Hinglish: Hum is recipe mein 'timestamps' bhi add kar rahe hain.
  // Isse har dish ke banne (createdAt) aur update hone (updatedAt) ka time automatically note ho jayega.
  { timestamps: true }
);

// Hinglish: Is recipe (schema) ko use karke hum ek actual dish-making model bana rahe hain,
// jiska naam 'User' hai. Ab hum is model se users bana payenge.
module.exports = mongoose.model("User", userSchema);