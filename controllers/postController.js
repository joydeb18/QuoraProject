const Post = require('../models/Post'); // Yeh line sure karti hai ki humara Chef recipe book (Post model) ko pehchan raha hai

// Dish 1: Saare posts ki list bhejna
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author', 'username').sort({ createdAt: -1 });
        res.json({ success: true, posts: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};

// Dish 2: Ek naya post banana
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        // Bouncer (middleware) ne user ki details req.user mein daal di thi. Hum wahan se ID nikaal rahe hain.
        const authorId = req.user.id; 

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title aur content, dono zaroori hain.' });
        }
        if (!authorId) {
             return res.status(401).json({ success: false, message: 'Aap logged-in nahi hain.' });
        }

        const newPost = new Post({
            title,
            content,
            author: authorId,
        });

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