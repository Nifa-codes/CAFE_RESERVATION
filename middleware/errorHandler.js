/* eslint-disable-next-line no-unused-vars */
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
  });
}
module.exports = errorHandler;
