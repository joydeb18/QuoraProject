const express = require("express");
const router = express.Router();

// Naye Chef aur Super Bouncer ko import karo
const userController = require("../controllers/userController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Route: Saare users ki list paane ke liye
// Is route par aane se pehle, user ko 'adminMiddleware' se guzarna padega
router.get("/", adminMiddleware, userController.getAllUsers);

module.exports = router;