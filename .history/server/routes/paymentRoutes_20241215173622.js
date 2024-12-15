// paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController'); // Đảm bảo đường dẫn này đúng

// Đảm bảo các route này có controller đúng
router.post('/create_payment_url', paymentController.createPaymentUrl);
router.get('/payment_callback', paymentController.paymentCallback);

module.exports = router;
