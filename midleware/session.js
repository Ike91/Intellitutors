const session = require("express-session");

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000, // Expires after 1 hour (in milliseconds)
    sameSite: true,
    secure: true,
  },
});

module.exports = sessionMiddleware;
