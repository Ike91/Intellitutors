const express = require("express");
const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//register a user
router.post("/register", registerController.register);

//login a user
router.post("/login", loginController.login);

// //Contact us
// router.post("/sendMail", authController.sendEmail);

//log out a user
router.get("/logout", (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }

    // Clear the HTTP-only
    res.clearCookie('token', { path: '/', httpOnly: true, expires: new Date(0) });
    
    res.redirect("/");
  });
});




module.exports = router;
