const express = require("express");
const { createPaymentUrl } = require("./paymentService");
const router = express.Router();

// Route tạo URL thanh toán
router.post("/create_payment_url", async (req, res) => {
  try {
    const { bookingId } = req.body; // Lấy bookingId từ request

    // Tạo URL thanh toán từ Booking
    const paymentUrl = await createPaymentUrl(bookingId);

    if (paymentUrl) {
      res.status(200).json({ paymentUrl }); // Trả về URL thanh toán VNPay
    } else {
      res.status(400).json({ error: "Không thể tạo URL thanh toán. Vui lòng thử lại." });
    }

  } catch (err) {
    res.status(500).json({ error: "Có lỗi xảy ra khi tạo URL thanh toán." });
  }
});