const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', reviewController.listAllReviews);
router.post('/', authMiddleware, reviewController.submitReview);
router.delete('/:id', authMiddleware, adminMiddleware, reviewController.deleteReview);

module.exports = router;