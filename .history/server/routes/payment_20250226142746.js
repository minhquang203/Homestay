require('dotenv').config(); // Load biến môi trường từ file .env

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');
const Booking = require('../models/Booking'); // Import model Booking

router.post('/create_payment_url', async (req, res) => {
  try {
    const { listingId, amount, customerId, bankCode } = req.body;
    if (!listingId || !amount || !customerId) {
      return res.status(400).json({ message: "Thông tin không đầy đủ" });
    }

    // Kiểm tra trạng thái của đơn đặt phòng
    const booking = await Booking.findById(listingId);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }
    if (booking.status !== "approved") {
      return res.status(400).json({ message: "Đơn đặt phòng chưa được duyệt" });
    }

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    if (!secretKey) {
      throw new Error('VNP_HASH_SECRET is not defined');
    }

    const orderId = date.getTime().toString(); // Tạo ID đơn hàng duy nhất từ thời gian hiện tại
    const orderInfo = `Thanh toán cho chuyến đi ${listingId}`;
    const orderAmount = parseInt(amount) * 100; // Nhân với 100 để tính bằng đồng VND

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: orderAmount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params); // Sắp xếp tham số để tạo chuỗi query

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey); // Tạo HMAC
    const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

    // Trả về URL thanh toán cho frontend
    res.json({ paymentUrl });
  } catch (err) {
    console.error('Lỗi khi tạo URL thanh toán:', err);
    res.status(500).json({ message: "Lỗi server. Vui lòng thử lại sau." });
  }
});

// Hàm sắp xếp các tham số trong đối tượng
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort(); // Sắp xếp theo thứ tự alphabet
  keys.forEach((key) => {
    sorted[key] = obj[key]; // Giữ nguyên giá trị, không encode ở đây
  });
  return sorted;
}

module.exports = router;