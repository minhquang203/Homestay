const jwt = require("jsonwebtoken");

exports.googleCallback = (req, res) => {
  try {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.redirect(`http://localhost:3000/login?token=${token}&message=success`);
  } catch (err) {
    console.error(err);
    res.redirect("http://localhost:3000/login?message=error");
  }
};
