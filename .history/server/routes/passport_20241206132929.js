const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Đường dẫn đến model User
const router = express.Router();
const dotenv = require("dotenv");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
dotenv.config();
// Cấu hình Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3002/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kiểm tra người dùng đã tồn tại trong database chưa
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Nếu chưa tồn tại, tạo mới tài khoản
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
        }

        // Trả về user đã xác thực
        done(null, user);
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        done(err, null);
      }
    }
  )
);

// Định nghĩa tuyến đăng nhập với Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Xử lý callback từ Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      // Kiểm tra user đã được gán vào req từ Passport
      if (!req.user) {
        throw new Error("Authentication failed, user not found.");
      }

      // Tạo JWT token
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      // Chuyển hướng về client với token và trạng thái
      res.redirect(`http://localhost:3000/login?token=${token}&message=success`);
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.redirect("http://localhost:3000/login?message=error");
    }
  }
);

// Xuất router để sử dụng trong app.js
module.exports = router;
