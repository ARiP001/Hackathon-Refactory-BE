const express = require("express");
const { listUsers } = require("../controllers/authController");
const { authenticate } = require("../middleware/authJwt");

// test
const router = express.Router();
const authRoute = require("./authRoute");
const productRoute = require("./productRoute");
const cartRoute = require("./cartRoute");

// Routes
router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/cart", cartRoute);

// Protected routes
router.get("/users", authenticate, listUsers);

module.exports = router;
