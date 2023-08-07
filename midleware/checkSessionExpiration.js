const sessionExpirationMiddleware = (req, res, next) => {
  if (req.session.lastActive && Date.now() - req.session.lastActive > 900000) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/login");
    });
  } else {
    next();
  }
};

module.exports = sessionExpirationMiddleware;
