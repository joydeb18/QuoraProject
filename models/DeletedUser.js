const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
  username: String,
  email: String,
  role: String,
  deletedAt: { type: Date, default: Date.now },
});

const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema);
module.exports = DeletedUser;