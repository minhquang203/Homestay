require('dotenv').config(); // Load biến môi trường từ file .env
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');
const Transaction = require('../models/Transaction');
router.post('/create_payment_url', async (req, res) => {
  try {
    const { totalPrice, customerId, hostId, bookingId, bankCode } = req.body;

    if (!totalPrice || !customerId || !hostId || !bookingId) {
      return res.status(400).json({ message: "❌ Thiếu thông tin bắt buộc!" });
    }

    // Tạo Transaction trước khi tạo URL thanh toán
    const orderId = new Date().getTime().toString();
    const transaction = new Transaction({
      bookingId,
      customerId,
      hostId,
      amount: totalPrice,
      status: "pending",
      paymentMethod: bankCode || "VNPAY",
      transactionId: orderId,
    });
    await transaction.save();

    // Tạo URL thanh toán với VNPAY (giữ nguyên phần tạo URL của bạn, chỉ sửa orderInfo)
    const orderInfo = `Thanh toán từ khách hàng ${customerId} cho chủ nhà ${hostId} - Booking ${bookingId}`;
    // ... (giữ nguyên phần còn lại của bạn)

    res.json({ paymentUrl });
  } catch (err) {
    console.error('🔥 Lỗi khi tạo URL thanh toán:', err);
    res.status(500).json({ message: "❌ Lỗi server. Vui lòng thử lại sau.", error: err.message });
  }
});

// Route xử lý callback từ VNPAY
router.get('/vnpay_return', async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const transactionId = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];

      const transaction = await Transaction.findOne({ transactionId });
      if (!transaction) {
        return res.status(404).json({ message: "Transaction không tồn tại" });
      }

      if (responseCode === "00") {
        // Thanh toán thành công
        transaction.status = "success";
        await transaction.save();

        // Cập nhật trạng thái Booking
        const booking = await Booking.findById(transaction.bookingId);
        booking.status = "approved";
        await booking.save();

        res.redirect('http://your-frontend-url/payment/success'); // Redirect về trang thành công
      } else {
        // Thanh toán thất bại
        transaction.status = "failed";
        await transaction.save();
        res.redirect('http://your-frontend-url/payment/failed'); // Redirect về trang thất bại
      }
    } else {
      res.status(400).json({ message: "❌ Chữ ký không hợp lệ!" });
    }
  } catch (err) {
    console.error('🔥 Lỗi khi xử lý callback VNPAY:', err);
    res.status(500).json({ message: "❌ Lỗi server." });
  }
});

// Hàm sắp xếp đối tượng theo thứ tự alphabet
function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = obj[key];
      return sorted;
    }, {});
}

module.exports = router;
