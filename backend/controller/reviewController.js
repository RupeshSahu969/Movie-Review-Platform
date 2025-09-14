const Review = require('../models/Review');
const Movie = require('../models/Movie');
const { reviewSchema } = require('../utils/validate');

exports.getReviewsForMovie = async (req, res) => {
  try {
    const { movieId } = req.params;  
    const reviews = await Review.find({ movie: movieId })
      .populate('user', 'username profilePicture'); 

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { error, value } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const existing = await Review.findOne({ movie: movie._id, user: req.user.id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this movie' });

    const review = await Review.create({
      movie: movie._id,
      user: req.user.id,
      rating: value.rating,
      text: value.text,
    });

    // Update average rating + review count
    const agg = await Review.aggregate([
      { $match: { movie: movie._id } },
      { $group: { _id: '$movie', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (agg[0]) {
      movie.averageRating = agg[0].avg;
      movie.reviewCount = agg[0].count;
      await movie.save();
    }

    const populated = await review.populate('user', 'username profilePicture');
    res.status(201).json({ populated, message: 'Review added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
