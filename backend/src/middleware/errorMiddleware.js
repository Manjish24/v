export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    message = `Resource not found with identifier of ${err.value}`;
    return res.status(404).json({ success: false, message });
  }

  if (err.code === 11000) {
    message = "Duplicate field value entered";
    return res.status(409).json({ success: false, message });
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors).map((val) => val.message).join(", ");
    return res.status(400).json({ success: false, message });
  }

  if (err.name === "JsonWebTokenError") {
    message = "Invalid authentication token";
    return res.status(401).json({ success: false, message });
  }

  if (err.name === "TokenExpiredError") {
    message = "Authentication token expired";
    return res.status(401).json({ success: false, message });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
