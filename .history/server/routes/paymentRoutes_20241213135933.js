// server/routes/paymentRoutes.js
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const { 
  MOMO_ACCESS_KEY, 
  MOMO_SECRET_KEY, 
  MOMO_PARTNER_CODE, 
  MOMO_REDIRECT_URL, 
  MOMO_IPN_URL, 
  MOMO_ORDER_INFO 
} = process.env;

// Tạo chữ ký MoMo
const generateSignature = (data) => {
  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${data.amount}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${MOMO_REDIRECT_URL}&ipnUrl=${MOMO_IPN_URL}`;
  return crypto.createHmac('sha256', MOMO_SECRET_KEY).update(rawSignature).digest('hex');
};

router.post("/momo", async (req, res) => {
  const { amount, orderInfo, redirectUrl, ipnUrl } = req.body;
  const orderId = MOMO_PARTNER_CODE + new Date().getTime();
  const requestId = orderId; // Đảm bảo requestId là duy nhất

  const signature = generateSignature({ amount, orderId, orderInfo });

  const paymentRequest = {
    partnerCode: MOMO_PARTNER_CODE,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    signature,
    lang: 'vi',
  };

  try {
    const momoResponse = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', paymentRequest);
    
    if (momoResponse.data.resultCode === "0") {
      res.json({ paymentUrl: momoResponse.data.payUrl });
    } else {
      res.status(400).json({ error: momoResponse.data.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Error while processing payment request." });
  }
});

module.exports = router;
