const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addReview, getReviewsForMovie } = require('../controller/reviewController');

router.get('/movie/:movieId', getReviewsForMovie);
router.post('/:movieId', protect, addReview);

module.exports = router;
