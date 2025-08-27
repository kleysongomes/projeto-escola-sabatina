const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', reviewController.listAllReviews);
router.post('/', authMiddleware, reviewController.submitReview);

module.exports = router;