function errorHandler(err, req, res, next) {
  // default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  details = { undefined };

  //  mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';

    details = Object.values(err).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // mongoose cast err (invalid objectId)
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (!err.isOperational) {
    console.error('UNEXCPETED ERROR:', err.message);
  }

  res.status(statusCode).json({
    error: {
      message,
      ...details,
    },
  });
}

module.exports = errorHandler;
