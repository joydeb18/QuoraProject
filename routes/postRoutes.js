const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Saare posts ki list paane ke liye
router.get("/", adminMiddleware, postController.getAllPosts);

// Ek post ko uski ID se paane ke liye
router.get("/:id", adminMiddleware, postController.getPostById);

// Ek naya post banane ke liye
router.post("/", adminMiddleware, postController.createPost);

// === YEH NAYA ROUTE HAI ===
// Ek post ko uski ID se delete karne ke liye (DELETE request)
router.delete("/:id", adminMiddleware, postController.deletePost);


module.exports = router;