const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts); // Get ALl Products
router.post("/", productController.createProduct); // Add New Products
router.get("/:id", productController.getProductById); // Get Products Detail
router.put("/:id", productController.updateProduct); // Update Product
router.delete("/:id", productController.deleteProduct); // Delete Product
router.patch("/status/:id", productController.updateProductStatus); // Update Product Status
router.get("/user/:user_id", productController.getProductsByUserId); // Get Products By User
router.get("/search", productController.getProductsBySearch); // Search Product

module.exports = router;