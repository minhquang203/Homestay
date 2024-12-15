// paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Đảm bảo rằng bạn gọi đúng hàm từ controller
router.post("/create_payment_url", paymentController.createPaymentUrl);
router.get("/payment_callback", paymentController.paymentCallback); // Đây là ví dụ sử dụng GET với hàm callback hợp lệ

module.exports = router;
