const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  // Check if the token exists in the session or cookies
  const token = req.session.token || req.cookies.token;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, "secretKey");
      req.user = decoded;
      next();
    } catch (error) {
      // Invalid token, redirect to the login page or handle the error accordingly
      console.log(error);
      res.redirect("/login");
    }
  } else {
    // Token doesn't exist, redirect to the login page or handle the authentication failure accordingly
    res.redirect("/login");
  }
};

module.exports = authenticate;
