const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Faltu space hata dega
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Yeh User model se link hoga
    ref: 'User', // 'User' model ka reference
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
}, { timestamps: true }); // 'createdAt' aur 'updatedAt' fields add kar dega

const Post = mongoose.model('Post', postSchema);
module.exports = Post;