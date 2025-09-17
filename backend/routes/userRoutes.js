const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de Autenticação e Cadastro
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/check-username', userController.checkUsername);
router.post('/logout', authMiddleware, userController.logoutUser);

// Rota Pública
router.get('/ranking', userController.getUserRanking);

// Rotas para buscar dados
router.get('/me', authMiddleware, userController.getUserProfile);
router.get('/me/reviews', authMiddleware, userController.getUserReviews);
router.get('/me/likes', authMiddleware, userController.getUserLikedReviews);
router.get('/me/points-history', authMiddleware, userController.getUserPointsHistory);

// Rotas para modificar dados
router.patch('/me/theme', authMiddleware, userController.updateUserTheme);
router.post('/me/accept-policy', authMiddleware, userController.acceptPrivacyPolicy);
router.patch('/me', authMiddleware, userController.updateUserProfile);
router.post('/me/change-password', authMiddleware, userController.changePassword);


module.exports = router;