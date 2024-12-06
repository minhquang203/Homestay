const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ message: "Token không được cung cấp!" }); // Nếu không có token
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm người dùng theo ID từ decoded
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" }); // Nếu người dùng không tồn tại
    }

    // Lưu thông tin người dùng vào request
    req.user = { id: user._id, role: user.role }; // Lưu id và role của người dùng

    next(); // Tiến hành xử lý tiếp theo trong pipeline của route
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ!" }); // Nếu token không hợp lệ
  }
};

module.exports = authMiddleware;
