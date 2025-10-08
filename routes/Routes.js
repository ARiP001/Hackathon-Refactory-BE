const express = require('express');
const { register, login, refresh, listUsers, verifyEmail, resendVerification } = require('../controllers/authController');
const { authenticate } = require('../middleware/authJwt');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
// test
const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.get('/auth/verify', verifyEmail);
router.post('/auth/resend', resendVerification);

// Profile update with optional image upload; accept any file field
const authController = require('../controllers/authController');
router.patch('/auth/profile', authenticate, upload.any(), authController.updateProfile);

router.get('/users', authenticate, listUsers);


module.exports = router;