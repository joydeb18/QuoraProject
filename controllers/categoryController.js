const Category = require('../models/Category');
const mongoose = require('mongoose');
const slugify = require('slugify');
const Post = require('../models/Post');

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

// Rename a category and cascade slug updates to posts
exports.renameCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const newSlug = slugify(name, { lower: true, strict: true });

    let doc;
    if (isValidObjectId(category)) {
      doc = await Category.findById(category);
    } else {
      doc = await Category.findOne({ slug: category.toLowerCase() });
    }
    if (!doc) return res.status(404).json({ message: 'Category not found' });

    const oldSlug = doc.slug;
    doc.name = name;
    doc.slug = newSlug;
    await doc.save();

    // Cascade update posts having old categorySlug
    await Post.updateMany({ categorySlug: oldSlug }, { $set: { categorySlug: newSlug } });

    res.json({ category: { _id: doc._id, name: doc.name, slug: doc.slug } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Rename a subcategory and cascade slug updates to posts under the category
exports.renameSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const newSubSlug = slugify(name, { lower: true, strict: true });

    let doc;
    if (isValidObjectId(category)) {
      doc = await Category.findById(category);
    } else {
      doc = await Category.findOne({ slug: category.toLowerCase() });
    }
    if (!doc) return res.status(404).json({ message: 'Category not found' });

    // find subcategory by id or slug
    let sub;
    if (isValidObjectId(subcategory)) {
      sub = doc.subcategories.id(subcategory);
    } else {
      sub = doc.subcategories.find(s => s.slug === String(subcategory).toLowerCase());
    }
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });

    const oldSubSlug = sub.slug;
    sub.name = name;
    sub.slug = newSubSlug;
    await doc.save();

    // Cascade update posts having this category+subcategory pair
    await Post.updateMany(
      { categorySlug: doc.slug, subcategorySlug: oldSubSlug },
      { $set: { subcategorySlug: newSubSlug } }
    );

    res.json({ subcategory: { _id: sub._id, name: sub.name, slug: sub.slug } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


