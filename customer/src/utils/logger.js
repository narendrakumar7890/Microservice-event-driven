function logger(req, res, next) {
  const start = Date.now();

  // Listen to the 'finish' event to log after the response has been sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - IP: ${req.ip} - User-Agent: ${req.headers["user-agent"]}`;
    console.log(logMessage); // Log the message to console or any logging service
  });

  next(); // Move to the next middleware
}

module.exports = logger;
