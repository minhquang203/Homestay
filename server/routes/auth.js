require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// Đăng ký người dùng
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Tất cả các trường là bắt buộc!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Người dùng đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Đăng ký thất bại!", error: err.message });
  }
});

// Đăng nhập người dùng
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email và mật khẩu là bắt buộc!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.password = undefined; // Xóa mật khẩu khỏi phản hồi

    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Đăng nhập thất bại!", error: err.message });
  }
});

// Route bảo vệ thông tin người dùng (ví dụ: profile)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy thông tin người dùng",
        error: err.message,
      });
  }
});

// Cập nhật thông tin người dùng
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, address, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email, address, phone },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res
      .status(200)
      .json({
        message: "Thông tin người dùng đã được cập nhật",
        user: updatedUser,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({
        message: "Lỗi khi cập nhật thông tin người dùng",
        error: err.message,
      });
  }
});
/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});


const upload = multer({ storage });

module.exports = router;
