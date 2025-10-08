const express = require("express");
const { listUsers } = require("../controllers/authController");
const { authenticate } = require("../middleware/authJwt");

// test
const router = express.Router();
const authRoute = require("./authRoute");
const productRoute = require("./productRoute");

// Routes
router.use("/auth", authRoute);
router.use("/products", productRoute)

// Protected routes
router.get("/users", authenticate, listUsers);

module.exports = router;
