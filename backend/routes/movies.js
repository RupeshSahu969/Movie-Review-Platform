const express = require('express');
const router = express.Router();
const { protect ,admin} = require('../middleware/auth');
const { getMovies, getMovieById, createMovie } = require('../controller/movieController');

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', protect, admin, createMovie);

module.exports = router;
