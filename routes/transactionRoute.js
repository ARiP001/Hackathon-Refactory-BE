const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { 
    createTransaction,
    getTransactionHistory,
    getTransactionById,
    getTransactionSummary,
    directPurchase,
    cancelTransaction,
} = transactionController;
const { authenticate } = require('../middleware/authJwt');

// All transaction operations require authentication
router.post("/", authenticate, createTransaction); // Create new transaction (checkout from cart)
router.post("/direct", authenticate, directPurchase); // Direct purchase without cart
router.get("/", authenticate, getTransactionHistory); // Get user's transaction history
router.get("/summary", authenticate, getTransactionSummary); // Get transaction summary/statistics
router.get("/:transaction_id", authenticate, getTransactionById); // Get specific transaction details
router.delete("/:transaction_id", authenticate, cancelTransaction); // Cancel transaction

module.exports = router;
