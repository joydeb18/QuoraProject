const Post = require('../models/Post');

// Dish 1: Saare posts ki list bhejna
exports.getAllPosts = async (req, res) => {
    // === JAASOOS WALI LINE ===
    console.log("getAllPosts API call hui!");
    try {
        const posts = await Post.find({}).populate('author', 'username').sort({ createdAt: -1 });
        // Ek aur jaasoos, yeh check karne ke liye ki database se kuch mila ya nahi
        console.log(`Database se ${posts.length} posts mile.`);
        res.json({ success: true, posts: posts });
    } catch (err) {
        console.error("getAllPosts mein error:", err.message);
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// Dish 2: Ek naya post banana
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user.id; 

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title aur content, dono zaroori hain.' });
        }
        
        const newPostData = {
            title,
            content,
            author: authorId,
        };

        if (req.file) {
            newPostData.imageUrl = req.file.path.replace(/\\/g, "/");
        }

        const newPost = new Post(newPostData);
        const savedPost = await newPost.save();
        res.status(201).json({
            success: true,
            message: 'Post successfully ban gaya!',
            post: savedPost,
        });

    } catch (err) {
        console.error("Create Post mein error:", err.message);
        res.status(500).json({ success: false, message: 'Post banane mein server error aaya.', error: err.message });
    }
};

// Baaki ke functions (get by ID, delete)
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ success: false, message: 'Post nahi mila.' });
        res.json({ success: true, post: post });
    } catch (err) { res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message }); }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post nahi mila.' });
        res.json({ success: true, message: 'Post successfully delete ho gaya!' });
    } catch (err) { res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message }); }
};