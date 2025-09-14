const User = require('../models/User');
const Watchlist = require('../models/Watchlist');
const Review = require('../models/Review');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const reviews = await Review.find({ user: req.params.id })
      .populate('movie', 'title posterUrl')  
      .populate('user', 'username profilePicture'); 
    const userProfile = {
      ...user.toObject(),
      reviews, 
    };

    res.json(userProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const update = {};

    if (req.body.username) update.username = req.body.username;

    if (req.file) {
      update.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).select('-password');

    res.json({ message: 'Updated Successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const items = await Watchlist.find({ user: req.params.id }).populate('movie');
    res.json(items.map((i) => i.movie));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'Movie ID is required' });

    const exists = await Watchlist.findOne({ user: req.params.id, movie: movieId });
    if (exists) return res.status(400).json({ message: 'Already in watchlist' });

    const item = await Watchlist.create({ user: req.params.id, movie: movieId });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { id, movieId } = req.params;
    await Watchlist.findOneAndDelete({ user: id, movie: movieId });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
