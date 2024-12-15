// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// API tạo URL thanh toán
router.post("/create_payment_url", paymentController.createPaymentUrl);

// API callback của thanh toán
router.get("/callback", paymentController.paymentCallback);

module.exports = router;
