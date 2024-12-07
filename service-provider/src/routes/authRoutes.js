// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();

router.get('/', AuthController.home);
router.get('/register', AuthController.register);
router.get('/login', AuthController.login);
router.get('/callback', AuthController.callback);
router.get('/logout', AuthController.logout);

module.exports = router;