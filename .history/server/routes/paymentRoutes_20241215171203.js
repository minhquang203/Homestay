const express = require("express");
const router = require("express").Router();
const paymentController = require("../controllers/paymentController"); // Chúng ta sẽ dùng controller đã viết

// API tạo URL thanh toán
router.post("/create_payment_url", paymentController.createPaymentUrl);

module.exports = router;
