function errorHandler(err, req, res, next) {

  console.error('--- ERROR LOG ---');
  console.error(err.stack || err);

  if (err.code === '23505') err.status = 409;
  if (err.code === '23503') err.status = 404;

  const statusCode = err.status || err.statusCode || 500;
  
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: message,
    status: statusCode,
  });
}

module.exports = { errorHandler };