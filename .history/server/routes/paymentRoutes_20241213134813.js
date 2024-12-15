require('dotenv').config();  // Đảm bảo rằng dotenv được cấu hình
const express = require("express");
const crypto = require("crypto");
const axios = require("axios"); // Đảm bảo bạn đã cài axios
const router = express.Router();

// Lấy thông tin từ biến môi trường
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const partnerCode = process.env.MOMO_PARTNER_CODE;
const redirectUrl = process.env.MOMO_REDIRECT_URL;
const ipnUrl = process.env.MOMO_IPN_URL;
const orderInfo = process.env.MOMO_ORDER_INFO;
const lang = 'vi'; // Bạn có thể tùy chỉnh lang nếu cần
const autoCapture = true;
const extraData = '';  // Dữ liệu bổ sung nếu có, để trống nếu không cần thiết
const requestType = 'payWithMethod'; // Loại yêu cầu, có thể là 'payWithMethod' hoặc các giá trị khác tùy MoMo yêu cầu

// Hàm tạo chữ ký MoMo
const generateSignature = (params) => {
  const rawSignature = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join("&");
  return crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex')
    .toUpperCase();
};

// Route xử lý thanh toán MoMo
router.post("/momo", async (req, res) => {
});

// Xử lý IPN (Instant Payment Notification)
router.post("/momo/ipn", (req, res) => {
  const { orderId, resultCode, message } = req.body;

  // Kiểm tra kết quả thanh toán từ MoMo
  if (resultCode === "0") {
    // Thanh toán thành công, cập nhật cơ sở dữ liệu hoặc các hành động khác
    console.log(`Payment success for Order ID: ${orderId}`);
    res.status(200).send("Success");
  } else {
    // Thanh toán thất bại
    console.log(`Payment failed for Order ID: ${orderId}. Message: ${message}`);
    res.status(400).send("Failed");
  }
});

// Hàm xác thực chữ ký và xử lý yêu cầu thanh toán từ phía client
router.post("/momo/verify", (req, res) => {
  const { signature, ...params } = req.body;

  // Tạo lại chữ ký từ các tham số
  const generatedSignature = generateSignature(params);

  // So sánh chữ ký
  if (signature === generatedSignature) {
    res.status(200).json({ message: "Signature verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
});

module.exports = router;
