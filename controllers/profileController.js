exports.profile = (req, res) => {
     // Get the user's email
    const token = req.cookies.token;
    
    let email;
      try {
        const decodedToken = jwt.verify(token, "secretKey");
        email = decodedToken.email;
      } catch (error) {
        return res.status(400).send("Bad Request");
    }
    
    studentModel.findUserByEmail(email, (err, user) => {
        if (err) {
            console.error("An error occurred while searching for the user:", err);
            return res.status(500).json({ error: "An error occurred while searching for the user" });
        } else {
            res.render("profile", {user})
        }
    });
}