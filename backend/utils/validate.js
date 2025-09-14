const Joi = require('joi');

exports.registerSchema = Joi.object({
  username: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  adminCode: Joi.string().optional(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown(true); 

exports.movieSchema = Joi.object({
  title: Joi.string().required(),
  genre: Joi.array().items(Joi.string()).optional(),
  releaseYear: Joi.number().integer().min(1878).optional(),
  director: Joi.string().optional(),
  cast: Joi.array().items(Joi.string()).optional(),
  synopsis: Joi.string().optional(),
  posterUrl: Joi.string().uri().optional(),
});


exports.reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  text: Joi.string().allow('').optional(),
});
