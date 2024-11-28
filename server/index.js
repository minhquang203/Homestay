const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();


const authRouter = require("./routes/auth"); // Đường dẫn đến router của bạn
const listingRoutes = require("./routes/listing.js")
const BookingRoutes = require("./routes/booking.js")
const userRoutes = require("./routes/user.js")

// Cấu hình middleware
app.use(express.json()); // Đảm bảo Express có thể hiểu dữ liệu JSON
app.use(cors()); // Cho phép các yêu cầu từ nguồn ngoài
app.use(express.static("public"));

// Kết nối MongoDB (đảm bảo bạn đã cấu hình đúng URI MongoDB của bạn)
mongoose.connect("mongodb://localhost:27017/booktravel", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Kết nối MongoDB thành công!");
}).catch(err => {
  console.error("Lỗi kết nối MongoDB:", err);
});

// Sử dụng router cho các yêu cầu liên quan đến auth
app.use("/auth", authRouter);
app.use("/properties",listingRoutes)
app.use("/bookings", BookingRoutes)
app.use("/users", userRoutes)

// Khởi động server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
