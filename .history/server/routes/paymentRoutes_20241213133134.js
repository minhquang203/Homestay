// server/routes/paymentRoutes.js
const express = require("express");
const crypto = require("crypto");
const https = require("https");
const router = express.Router();

// Thông tin cấu hình MoMo
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const orderInfo = 'pay with MoMo';
const redirectUrl = 'http://localhost:3000/payment/success';  // URL quay lại sau thanh toán thành công
const ipnUrl = 'http://localhost:3000/payment/ipn';  // IPN URL để nhận thông báo từ MoMo

// Route xử lý thanh toán MoMo
router.post("/momo", async (req, res) => {
    const { partnerCode, partnerName, storeId, requestId, amount, orderId, orderInfo, redirectUrl, ipnUrl, signature } = req.body;
  
    // Kiểm tra chữ ký (signature)
    const generatedSignature = generateSignature(req.body); // Hàm generateSignature cần được viết để tính toán chữ ký
  
    if (signature !== generatedSignature) {
      return res.status(400).json({ error: "Invalid signature" });
    }
  
    // Tạo request MoMo
    const paymentRequest = {
      partnerCode,
      partnerName,
      storeId,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      signature,
    };
  
    try {
      // Gửi yêu cầu đến MoMo API (sử dụng thư viện như axios để gọi MoMo API)
      const momoResponse = await axios.post(MOMO_API_URL, paymentRequest);
      res.json(momoResponse.data);
    } catch (error) {
      res.status(500).json({ error: "Payment API request failed" });
    }
  });

module.exports = router;
