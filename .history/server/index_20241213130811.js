const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");

// Khởi tạo ứng dụng Express
const app = express();

// Load biến môi trường từ file .env
dotenv.config();

// Import các router
const authRouter = require("./routes/auth");
const listingRoutes = require("./routes/listing");
const bookingRoutes = require("./routes/booking");
const userRoutes = require("./routes/user");
const paymentRoutes = require("./routes/paymentRoutes")

// Cấu hình middleware
app.use(express.json()); // Cho phép xử lý dữ liệu JSON
app.use(cors()); // Hỗ trợ CORS
app.use(express.static("public")); // Cung cấp tài nguyên tĩnh từ thư mục public
app.use(passport.initialize());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Kết nối MongoDB thành công!");
  })
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err);
  });

// Định tuyến API
app.use("/auth", authRouter); // Đăng nhập/đăng ký
app.use("/properties", listingRoutes); // Quản lý danh sách bất động sản
app.use("/bookings", bookingRoutes); // Quản lý đặt chỗ
app.use("/users", userRoutes); // Quản lý thông tin người dùng
app.use("/payment", paymentRoutes);



// Xử lý lỗi 404 cho các API không tồn tại
app.use((req, res, next) => {
  res.status(404).json({ error: "API không tồn tại." });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Đã xảy ra lỗi từ server." });
});

// Khởi động server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
