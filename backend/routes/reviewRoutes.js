const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rotas para usuários
router.get('/', authMiddleware, reviewController.listAllReviews);
router.post('/', authMiddleware, reviewController.submitReview);
router.post('/:id/like', authMiddleware, reviewController.likeReview);
router.post('/:id/report', authMiddleware, reviewController.reportReview);

// Rotas para Adm
router.delete('/:id', authMiddleware, adminMiddleware, reviewController.deleteReview);
router.get('/reported', authMiddleware, adminMiddleware, reviewController.listReportedReviews);


module.exports = router;