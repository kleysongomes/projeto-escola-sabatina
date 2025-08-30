const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController');
const authMiddleware = require('../middleware/authMiddleware');

// Define a rota POST para /api/bugs/
// A rota é protegida, apenas usuários logados podem reportar bugs.
router.post('/', authMiddleware, bugController.createBugReport);

module.exports = router;