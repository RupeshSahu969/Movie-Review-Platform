const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      index: true,
    },
    releaseYear: {
      type: Number,
      min: 1888, 
    },
    director: {
      type: String,
      trim: true,
    },
    cast: {
      type: [String],
      default: [],
    },
    synopsis: {
      type: String,
      maxlength: 1000,
    },
    posterUrl: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Movie', movieSchema);
