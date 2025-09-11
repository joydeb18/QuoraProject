const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
  },
  authorSnapshot: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    username: { type: String }
  },
  categorySlug: {
    type: String,
    index: true,
    lowercase: true,
    trim: true
  },
  subcategorySlug: {
    type: String,
    index: true,
    lowercase: true,
    trim: true
  }
}, { timestamps: true });

postSchema.index({ categorySlug: 1, subcategorySlug: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;