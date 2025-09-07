const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Yahan 'unique' rehna zaroori hai
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'disabled'], // Ab yahan sirf active/disabled hai
    default: 'active',
  }
}, { timestamps: true }); // Yeh 'createdAt' aur 'updatedAt' fields add kar dega

const User = mongoose.model('User', userSchema);
module.exports = User;