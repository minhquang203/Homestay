// paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Đảm bảo rằng bạn đã import controller đúng và gọi hàm xử lý
router.post("/create_payment_url", paymentController.createPaymentUrl);
router.get("/payment_callback", paymentController.paymentCallback);  // Chỉnh lại đường dẫn callback

module.exports = router;
