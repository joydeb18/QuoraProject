const Post = require('../models/Post');

// Dish 1: Saare posts ki list bhejna
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author', 'username').sort({ createdAt: -1 });
        res.json({ success: true, posts: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// === YEH NAYI DISH HAI ===
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