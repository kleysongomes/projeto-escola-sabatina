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

// Rotas de Perfil do Usuário Logado ('/me')
router.get('/me', authMiddleware, userController.getUserProfile);
router.get('/me/reviews', authMiddleware, userController.getUserReviews);
router.get('/me/likes', authMiddleware, userController.getUserLikedReviews);

// Rota para o usuário atualizar sua preferência de tema
router.patch('/me/theme', authMiddleware, userController.updateUserTheme);

// Rota para o usuário aceitar a política de privacidade
router.post('/me/accept-policy', authMiddleware, userController.acceptPrivacyPolicy);


module.exports = router;