const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  resendVerification,
  updateProfile,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/authJwt");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/logout", authenticate, logout);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

router.get("/verify", verifyEmail);
router.post("/resend", resendVerification);
router.patch("/profile", authenticate, upload.any(), updateProfile);

module.exports = router;
