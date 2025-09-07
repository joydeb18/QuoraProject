const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
// Yahan humne adminMiddleware ko import kiya hai
const adminMiddleware = require("../middleware/adminMiddleware");

// Route 1: Saare posts ki list paane ke liye (GET request)
router.get("/", adminMiddleware, postController.getAllPosts);

// Route 2: Ek naya post banane ke liye (POST request)
router.post("/", adminMiddleware, postController.createPost);

module.exports = router;