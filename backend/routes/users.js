const express = require('express');
const router = express.Router();
const { protect,admin } = require('../middleware/auth');
const {
   getProfile,
  updateProfile,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require('../controller/userController');
const upload = require('../middleware/upload'); 

router.get('/:id', protect, getProfile);
router.put('/:id', protect, upload.single('profilePicture'), updateProfile);

router.get('/:id/watchlist', protect, getWatchlist);
router.post('/:id/watchlist', protect, addToWatchlist);
router.delete('/:id/watchlist/:movieId', protect, removeFromWatchlist);

module.exports = router;
