const Post = require('../models/Post');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const User = require('../models/User');

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

async function resolveCategorySlug(input) {
    if (!input) return undefined;
    if (isValidObjectId(input)) {
        const cat = await Category.findById(input).lean();
        return cat ? cat.slug : undefined;
    }
    return String(input).toLowerCase();
}

async function resolveSubcategorySlug(categoryIdentifier, subIdentifier) {
    if (!subIdentifier) return undefined;
    const category = isValidObjectId(categoryIdentifier)
        ? await Category.findById(categoryIdentifier)
        : await Category.findOne({ slug: String(categoryIdentifier).toLowerCase() });
    if (!category) return undefined;
    if (isValidObjectId(subIdentifier)) {
        const sub = category.subcategories.id(subIdentifier);
        return sub ? sub.slug : undefined;
    }
    return String(subIdentifier).toLowerCase();
}

// Dish 1: Saare posts ki list bhejna (Updated and Cleaned)
exports.getAllPosts = async (req, res) => {
    // === JAASOOS WALI LINE ===
    console.log("getAllPosts API call hui!");
    try {
        const { category, subcategory } = req.query;
        const filter = {};
        if (category) filter.categorySlug = String(category).toLowerCase();
        if (subcategory) filter.subcategorySlug = String(subcategory).toLowerCase();
        const posts = await Post.find(filter).populate('author', 'username').sort({ createdAt: -1 });
        
        // Ek aur jaasoos, yeh check karne ke liye ki database se kuch mila ya nahi
        console.log(`Database se ${posts.length} posts mile.`);
        
        res.json({ success: true, posts: posts });
    } catch (err) {
        console.error("getAllPosts mein error:", err.message);
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// ... (baaki ke functions waise hi rahenge) ...

// Dish 2: Ek post ko uski ID se dhoondh kar bhejna
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post nahi mila.' });
        }
        res.json({ success: true, post: post });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// Dish 3: Ek naya post banana
exports.createPost = async (req, res) => {
    try {
        const { title, content, category, subcategory } = req.body;
        const authorId = req.user.id;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title aur content, dono zaroori hain.' });
        }

        const categorySlug = await resolveCategorySlug(category);
        const subcategorySlug = category ? await resolveSubcategorySlug(category, subcategory) : undefined;

        const authorUser = await User.findById(authorId).select('username').lean();

        const newPostData = {
            title,
            content,
            author: authorId,
            authorSnapshot: authorUser ? { _id: authorId, username: authorUser.username } : undefined,
            categorySlug,
            subcategorySlug
        };
        if (req.files && req.files.length > 0) {
            newPostData.imageUrls = req.files.map(file => file.path.replace(/\\/g, "/"));
        }
        const newPost = new Post(newPostData);
        const savedPost = await newPost.save();
        res.status(201).json({ success: true, message: 'Post successfully ban gaya!', post: savedPost });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Post banane mein server error aaya.', error: err.message });
    }
};

// Dish 4: Ek post ko update karna
exports.updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post nahi mila.' });
        }
        post.title = title || post.title;
        post.content = content || post.content;
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path.replace(/\\/g, "/"));
            // Combine existing and new URLs, then remove duplicates using a Set
            const combinedImageUrls = [...(post.imageUrls || []), ...newImageUrls];
            post.imageUrls = Array.from(new Set(combinedImageUrls));
        }
        const updatedPost = await post.save();
        res.json({ success: true, message: 'Post successfully update ho gaya!', post: updatedPost });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Post update karne mein server error aaya.', error: err.message });
    }
};

// Dish 5: Ek post ko delete karna
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post nahi mila.' });
        }
        res.json({ success: true, message: 'Post successfully delete ho gaya!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// Get posts by subcategory
exports.getPostsBySubcategory = async (req, res) => {
    try {
        const { categorySlug, subcategorySlug } = req.params;
        const posts = await Post.find({ categorySlug, subcategorySlug }).populate('author', 'username').sort({ createdAt: -1 });
        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};
