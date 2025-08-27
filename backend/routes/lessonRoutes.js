const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/today', authMiddleware, lessonController.getDailyLesson);

module.exports = router;