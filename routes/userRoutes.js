const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", adminMiddleware, userController.getAllUsers);
router.get("/deleted", adminMiddleware, userController.getDeletedUsers);
router.put("/:id/status", adminMiddleware, userController.updateUserStatus);
router.put("/:id/role", adminMiddleware, userController.updateUserRole);
router.delete("/:id", adminMiddleware, userController.deleteUser);

module.exports = router;