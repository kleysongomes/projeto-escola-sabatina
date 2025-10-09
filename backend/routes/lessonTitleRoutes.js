const express = require('express');
const router = express.Router();
const lessonTitleController = require('../controllers/lessonTitleController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rota pública para qualquer usuário buscar o título de hoje
router.get('/hoje', lessonTitleController.getTodayTitle);

// Rota protegida para administradores criarem/atualizarem títulos
router.post('/', authMiddleware, adminMiddleware, lessonTitleController.upsertTitle);

module.exports = router;