// paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController"); // Đảm bảo đường dẫn đúng

// API tạo URL thanh toán
router.post("/create_payment_url", paymentController.createPaymentUrl);

module.exports = router;
