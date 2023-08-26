module.exports = (err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode);
  const stack = process.env.NODE_ENV === "production" ? null : err.stack;
  res.json({
    code: statusCode,
    stack,
  });
};
