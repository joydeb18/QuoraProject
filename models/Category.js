const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true, index: true }
}, { _id: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  subcategories: { type: [subcategorySchema], default: [] }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;


