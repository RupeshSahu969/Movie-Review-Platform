const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.isJoi) {
    return res.status(400).json({
      message: err.details.map(d => d.message).join(', '),
    });
  }

  if (err.code && err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `${key} already exists` });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Server Error',
  });
};

module.exports = errorHandler; 
