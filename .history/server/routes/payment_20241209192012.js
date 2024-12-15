const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

router.post("/payment/momo", async (req, res) => {
  const { amount, orderId, returnUrl, cancelUrl } = req.body;

  // Thực hiện API gọi tới Momo để tạo đơn thanh toán
  const momoApiUrl = "https://test-payment.momo.vn/v2/gateway/api/create"; // Địa chỉ API Momo

  const momoPayload = {
    amount,
    orderId,
    returnUrl,
    cancelUrl,
    // Các tham số yêu cầu khác của Momo
  };

  try {
    const momoResponse = await fetch(momoApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(momoPayload),
    });

    const momoResult = await momoResponse.json();

    if (momoResult && momoResult.paymentUrl) {
      res.json({ paymentUrl: momoResult.paymentUrl });
    } else {
      res.status(500).json({ message: "Không thể tạo đơn thanh toán." });
    }
  } catch (err) {
    console.error("Lỗi khi gọi API Momo:", err);
    res.status(500).json({ message: "Lỗi hệ thống." });
  }
});

module.exports = router;
