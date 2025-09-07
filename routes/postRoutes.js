const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

const postController = require("../controllers/postController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Multer ka setup
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes
router.get("/", adminMiddleware, postController.getAllPosts);
router.get("/:id", adminMiddleware, postController.getPostById);
router.post("/", adminMiddleware, upload.single('image'), postController.createPost);
router.delete("/:id", adminMiddleware, postController.deletePost);

module.exports = router;