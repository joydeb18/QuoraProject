const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Route 1: Saare posts ki list paane ke liye (GET request)
router.get("/", adminMiddleware, postController.getAllPosts);

// === YEH NAYA ROUTE HAI ===
// Route 2: Ek post ko uski ID se paane ke liye (GET request)
router.get("/:id", adminMiddleware, postController.getPostById);

// Route 3: Ek naya post banane ke liye (POST request)
router.post("/", adminMiddleware, postController.createPost);

module.exports = router;