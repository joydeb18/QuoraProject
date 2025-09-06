const mongoose = require('mongoose');

// User ka schema, jismein 'role' bhi hai
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: { // Hum password ko hash karke isme save karenge
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Sirf yeh do values ho sakti hain.
    default: 'user',        // Har naya user automatic 'user' hi banega.
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;