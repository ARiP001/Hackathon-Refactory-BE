const express = require('express');
const { register, login, refresh, listUsers, verifyEmail, resendVerification } = require('../controllers/authController');
const { authenticate } = require('../middleware/authJwt');
// test
const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.get('/auth/verify', verifyEmail);
router.post('/auth/resend', resendVerification);

router.get('/users', authenticate, listUsers);


module.exports = router;