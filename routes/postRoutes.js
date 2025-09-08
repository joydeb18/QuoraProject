const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postController = require("../controllers/postController");
// Dono bouncers ko import kar rahe hain
const authMiddleware = require("../middleware/authMiddleware"); // Normal Bouncer
const adminMiddleware = require("../middleware/adminMiddleware"); // VIP Bouncer

// Multer ka setup...
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// === YAHAN KE RULES KO SAMJHO ===

// In do routes par koi bhi logged-in user aa sakta hai (isliye authMiddleware hai)
router.get("/", authMiddleware, postController.getAllPosts);
router.get("/:id", authMiddleware, postController.getPostById);

// In teen routes par sirf admin aa sakta hai (isliye adminMiddleware hai)
router.post("/", adminMiddleware, upload.single('image'), postController.createPost);
router.put("/:id", adminMiddleware, upload.single('image'), postController.updatePost);
router.delete("/:id", adminMiddleware, postController.deletePost);

module.exports = router;