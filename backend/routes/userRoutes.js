const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/ranking', userController.getUserRanking);
router.post('/check-username', userController.checkUsername);
router.post('/logout', authMiddleware, userController.logoutUser);

module.exports = router;