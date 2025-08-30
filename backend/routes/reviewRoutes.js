const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, reviewController.listAllReviews);
router.post('/', authMiddleware, reviewController.submitReview);
router.delete('/:id', authMiddleware, adminMiddleware, reviewController.deleteReview);
router.post('/:id/like', authMiddleware, reviewController.likeReview);
router.post('/:id/report', authMiddleware, reviewController.reportReview);


module.exports = router;