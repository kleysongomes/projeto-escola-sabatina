const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/ranking', userController.getUserRanking);

// Rota para verificar a disponibilidade de um nome de usuário
router.post('/check-username', userController.checkUsername);

module.exports = router;