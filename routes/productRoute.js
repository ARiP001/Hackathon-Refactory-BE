const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { 
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByUserId,
    getProductsBySearch,
 } = productController;
const { authenticate } = require('../middleware/authJwt');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getAllProducts); 
router.post(
  "/",
  authenticate,
  upload.fields([
    { name: 'highlight_img', maxCount: 1 },
    { name: 'detail_img', maxCount: 10 },
  ]),
  createProduct
);
// Place specific routes before the parameter route to avoid conflicts
router.get("/search", getProductsBySearch); // Search Product
router.get("/user/:user_id", getProductsByUserId); // Get Products By User (public)
router.get("/:id", getProductById); // Get Products Detail
router.put("/:id", authenticate, updateProduct); // Update Product (owner only)
router.delete("/:id", authenticate, deleteProduct); // Delete Product (owner only)
// router.patch removed: status can be updated via PUT /:id

module.exports = router;