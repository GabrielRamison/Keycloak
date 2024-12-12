const express = require('express');
const HomeController = require('../controllers/homeController');
const LoginController = require('../controllers/LoginController');
const LoginCallbackController = require('../controllers/loginCallbackController');
const LogoutController = require('../controllers/LogoutController');
const UserInfoController = require('../controllers/userInfoController');

const router = express.Router();

router.get('/', HomeController.handle);
router.get('/userinfo', UserInfoController.handle);
router.get('/login', LoginController.handle);
router.get('/register', LoginController.handle);
router.get('/callback', LoginCallbackController.handle);
router.get('/logout', LogoutController.handle);

module.exports = router;