const Category = require('../models/Category');
const mongoose = require('mongoose');
const slugify = require('slugify');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    const category = await Category.create({ name, slug });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { category } = req.params;
    let doc;
    if (isValidObjectId(category)) {
      doc = await Category.findById(category);
    } else {
      doc = await Category.findOne({ slug: category.toLowerCase() });
    }
    if (!doc) return res.status(404).json({ message: 'Category not found' });
    const { _id, name, slug, subcategories } = doc.toObject();
    res.json({ category: { _id, name, slug }, subcategories });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const subSlug = slugify(name, { lower: true, strict: true });

    let doc;
    if (isValidObjectId(category)) {
      doc = await Category.findById(category);
    } else {
      doc = await Category.findOne({ slug: category.toLowerCase() });
    }
    if (!doc) return res.status(404).json({ message: 'Category not found' });

    const exists = doc.subcategories.some(s => s.slug === subSlug || s.name === name);
    if (exists) return res.status(400).json({ message: 'Subcategory already exists' });

    const subcategory = { name, slug: subSlug };
    doc.subcategories.push(subcategory);
    await doc.save();
    const saved = doc.subcategories.find(s => s.slug === subSlug);
    res.status(201).json({ subcategory: saved });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


