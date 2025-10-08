const express = require("express");
const { listUsers } = require("../controllers/authController");
const { authenticate } = require("../middleware/authJwt");

// test
const router = express.Router();
const authRoute = require("./authRoute");
const productRoute = require("./productRoute");
const cartRoute = require("./cartRoute");
const transactionRoute = require("./transactionRoute");

// Health check endpoint
router.get("/", (req, res) => {
  res.send("BE ready dipake");
});

// Routes
router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/cart", cartRoute);
router.use("/transactions", transactionRoute);

// Protected routes
router.get("/users", authenticate, listUsers);

module.exports = router;
