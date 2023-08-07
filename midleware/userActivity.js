const userActivityMiddleware = (req, res, next) => {
  if (req.session.user) {
    req.session.lastActive = Date.now();
  }
  next();
};

module.exports = userActivityMiddleware;
