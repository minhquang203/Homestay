// auth.js (hoặc routes/auth.js tùy vào cấu trúc của bạn)
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import model người dùng, tùy vào cấu trúc database của bạn
const router = express.Router();

router.get("/me", async (req, res) => {
  // Lấy token từ header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, "your_jwt_secret");

    // Lấy thông tin người dùng từ database
    const user = await User.findById(decoded.id);

    if (user) {
      // Trả về thông tin người dùng nếu tìm thấy
      res.json({ user });
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
});

module.exports = router;
