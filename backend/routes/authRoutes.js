const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para renovar o access token
router.post('/refresh', authController.refreshToken);

module.exports = router;