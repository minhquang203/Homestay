const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token không được cung cấp!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    req.user = { id: user._id, role: user.role }; // Lưu thông tin id và role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

module.exports = authMiddleware;
