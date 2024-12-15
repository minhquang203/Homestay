const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");

// Khởi tạo ứng dụng Express
const app = express();

// Load biến môi trường từ file .env
dotenv.config();

// Middleware xử lý JSON và CORS
app.use(express.json());
app.use(cors());

// Cung cấp tài nguyên tĩnh từ thư mục "public"
app.use(express.static("public"));

// Khởi tạo Passport (nếu sử dụng cho xác thực)
app.use(passport.initialize());

// Kết nối MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Kết nối MongoDB thành công!");
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1); // Thoát chương trình nếu không kết nối được
  }
};
connectMongoDB();

// Import các router
const authRouter = require("./routes/auth");
const listingRoutes = require("./routes/listing");
const bookingRoutes = require("./routes/booking");
const userRoutes = require("./routes/user");
const paymentRoutes = require("./routes/paymentRoutes");

// Định tuyến API
app.use("/auth", authRouter); // Đăng nhập/đăng ký
app.use("/properties", listingRoutes); // Quản lý danh sách bất động sản
app.use("/bookings", bookingRoutes); // Quản lý đặt chỗ
app.use("/users", userRoutes); // Quản lý thông tin người dùng
app.use("/payment", paymentRoutes); // Xử lý thanh toán

// Middleware xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: "Đường dẫn không tồn tại." });
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error("Lỗi:", err.stack);
  res.status(500).json({ error: "Đã xảy ra lỗi từ phía server." });
});

// Khởi động server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
