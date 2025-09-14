const Movie = require('../models/Movie');
const Review = require('../models/Review');
const { movieSchema } = require('../utils/validate');

exports.getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 12, genre, year, q, minRating, sort } = req.query;
    const filter = {};

    if (genre) filter.genre = { $in: Array.isArray(genre) ? genre : [genre] };
    if (year) filter.releaseYear = Number(year);
    if (minRating) filter.averageRating = { $gte: Number(minRating) };
    if (q) filter.title = { $regex: q, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);

    const sortObj = sort === 'rating' ? { averageRating: -1 } : { createdAt: -1 };

    const [movies, total] = await Promise.all([
      Movie.find(filter).skip(skip).limit(Number(limit)).sort(sortObj),
      Movie.countDocuments(filter),
    ]);

    res.json({
      data: movies,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const reviews = await Review.find({ movie: movie._id }).populate(
      'user',
      'username profilePicture'
    );

    res.json({ movie, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.createMovie = async (req, res) => {
  try {
    const { error, value } = movieSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const movie = await Movie.create(value);
    console.log(movie);
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
