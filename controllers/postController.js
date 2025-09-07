const Post = require('../models/Post');

// ... (getAllPosts, getPostById, createPost functions waise hi rahenge) ...
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author', 'username').sort({ createdAt: -1 });
        res.json({ success: true, posts: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};
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
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user.id; 
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title aur content, dono zaroori hain.' });
        }
        const newPost = new Post({ title, content, author: authorId });
        const savedPost = await newPost.save();
        res.status(201).json({ success: true, message: 'Post successfully ban gaya!', post: savedPost });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Post banane mein server error aaya.', error: err.message });
    }
};

// === YEH NAYI DISH HAI ===
// Dish 4: Ek post ko uski ID se delete karna
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