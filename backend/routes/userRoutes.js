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

// Rota para buscar os dados cadastrais do usuário logado
router.get('/me', authMiddleware, userController.getUserProfile);

// Rota para buscar as reviews escritas pelo usuário logado
router.get('/me/reviews', authMiddleware, userController.getUserReviews);

// Rota para buscar as reviews curtidas pelo usuário logado
router.get('/me/likes', authMiddleware, userController.getUserLikedReviews);


module.exports = router;