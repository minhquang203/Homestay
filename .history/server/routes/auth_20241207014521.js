require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");


const User = require("../models/User");
const passport = require("passport");
const authMiddleware = require("../middleware/auth");
const GoogleStrategy = require("passport-google-oauth20").Strategy;




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

// Route bảo vệ thông tin người dùng
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

// Định nghĩa chiến lược Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Lấy từ Google Cloud
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3002/auth/google/callback", // URI chuyển hướng
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Kiểm tra người dùng đã tồn tại trong cơ sở dữ liệu chưa
        let user = await User.findOne({ googleId: profile.id });

        // Nếu chưa có người dùng, tạo mới
        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id, // Lưu googleId vào cơ sở dữ liệu
          });
        }

        // Trả về người dùng khi tìm thấy hoặc tạo mới thành công
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Đăng nhập với Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback của Google khi đăng nhập thành công
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // Tắt session vì ta sẽ dùng JWT thay vì session cookie
  (req, res) => {
    try {
      // Tạo JWT cho người dùng với id của họ trong cơ sở dữ liệu
      const token = jwt.sign(
        { userId: req.user.id }, // Payload là userId
        process.env.JWT_SECRET,   // Sử dụng JWT_SECRET từ file .env
        { expiresIn: "1d" }       // Token hết hạn sau 1 ngày
      );

      // Redirect về client với token trong query string
      res.redirect(`http://localhost:3000/login?token=${token}&message=success`);
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.redirect("http://localhost:3000/login?message=error");
    }
  }
);
router.get("/auth/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
    const user = await User.findById(decoded.userId); // Lấy thông tin người dùng từ cơ sở dữ liệu

    if (user) {
      res.json({ user }); // Trả về thông tin người dùng
    } else {
      res.status(404).json({ message: "Không tìm thấy người dùng." });
    }
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
});




 

const upload = multer({ storage });

module.exports = router;
