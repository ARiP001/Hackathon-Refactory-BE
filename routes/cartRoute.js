const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { 
    getCartByUserId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = cartController;
const { authenticate } = require('../middleware/authJwt');

// All cart operations require authentication
router.get("/", authenticate, getCartByUserId); // Get user's cart
router.post("/", authenticate, addToCart); // Add item to cart
router.put("/:cart_id", authenticate, updateCartItem); // Update cart item quantity
router.delete("/:cart_id", authenticate, removeFromCart); // Remove specific item from cart
router.delete("/", authenticate, clearCart); // Clear entire cart

module.exports = router;
