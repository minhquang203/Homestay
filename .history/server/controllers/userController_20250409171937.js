const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy thông tin người dùng", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, address, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, address, phone },
      { new: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.status(200).json({ message: "Cập nhật thành công!", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật!", error: err.message });
  }
};

exports.getMeFromToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token không hợp lệ" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
