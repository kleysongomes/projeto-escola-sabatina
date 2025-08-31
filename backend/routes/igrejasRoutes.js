const express = require('express');
const router = express.Router();
const igrejasController = require('../controllers/igrejasController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota PÚBLICA para listar todas as igrejas (para o formulário de cadastro)
router.get('/', igrejasController.listAllIgrejas);

// Rota para criar uma nova igreja.
// REMOVEMOS o 'authMiddleware' daqui para permitir que usuários não logados criem uma igreja durante o cadastro.
//TODO: Melhorar essa rota não pode ser publica pra sempre, um captcha
router.post('/', igrejasController.createIgreja);

module.exports = router;