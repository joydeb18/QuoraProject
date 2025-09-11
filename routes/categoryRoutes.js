const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');

router.get('/', authMiddleware, categoryController.listCategories);
router.post('/', adminMiddleware, categoryController.createCategory);
router.get('/:category', authMiddleware, categoryController.getCategory);
router.post('/:category/subcategories', adminMiddleware, categoryController.createSubcategory);
router.put('/:category', adminMiddleware, categoryController.renameCategory);
router.put('/:category/subcategories/:subcategory', adminMiddleware, categoryController.renameSubcategory);

module.exports = router;


