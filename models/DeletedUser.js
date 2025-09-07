const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
  username: String,
  email: String, // Yahan 'unique: true' nahi hai, taaki user dobara signup kar sake
  role: String,
  deletedAt: {    // Hum yeh record karenge ki user kab delete hua
    type: Date,
    default: Date.now,
  },
});

const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema);
module.exports = DeletedUser;