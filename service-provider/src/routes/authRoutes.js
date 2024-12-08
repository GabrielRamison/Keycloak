const express = require('express');
const HomeController = require('../controllers/homeController');
const LoginController = require('../controllers/LoginController');
const LoginCallbackController = require('../controllers/loginCallbackController');
const LogoutController = require('../controllers/LogoutController');

const router = express.Router();

router.get('/', HomeController.handle);
router.get('/login', LoginController.handle);
router.get('/callback', LoginCallbackController.handle);
router.get('/logout', LogoutController.handle);

module.exports = router;