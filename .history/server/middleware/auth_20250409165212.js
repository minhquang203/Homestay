const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token hoặc định dạng không hợp lệ!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ!", error: err.message });
  }
};

module.exports = authMiddleware;
