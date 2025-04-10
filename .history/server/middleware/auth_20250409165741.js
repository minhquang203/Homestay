const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Token không được cung cấp!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Người dùng không tồn tại!" });

    req.user = user; // lưu thông tin user để dùng ở các route sau
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

module.exports = authMiddleware;
