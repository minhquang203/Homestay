const express = require('express');
const crypto = require('crypto');
const querystring = require('qs');
const Booking = require('../models/Booking'); // Import mô hình Booking
const config = require('../config/vnpayConfig'); // Import cấu hình VNPay
const router = express.Router();

// API để tạo URL thanh toán
router.post('/create_payment_url', async function (req, res) {
  const { bookingId } = req.body; // Lấy bookingId từ request

  try {
    // Tìm thông tin booking từ MongoDB
    const booking = await Booking.findById(bookingId).populate('customerId'); // Dùng populate để lấy thông tin người đặt

    if (!booking) {
      return res.status(400).json({ message: 'Không tìm thấy đơn đặt phòng.' });
    }

    // Lấy thông tin từ booking
    const { customerId, orderInfo, totalPrice } = booking;
    const ipAddr = req.ip;  // Địa chỉ IP của người dùng
    const date = new Date();
    const createDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Định dạng thời gian cho yêu cầu
    const orderId = Date.now(); // Mã đơn hàng dựa trên thời gian hiện tại

    // Lấy các thông tin người đặt từ customerId (user)
    const customerName = customerId.name;
    const customerEmail = customerId.email;

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: config.vnp_TmnCode, // Lấy mã TMN từ cấu hình
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo, // Thông tin đơn hàng
      vnp_Amount: totalPrice * 100,  // VNPay yêu cầu số tiền tính theo đơn vị "VND"
      vnp_ReturnUrl: config.vnp_ReturnUrl, // URL trả về từ cấu hình
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_CustomerId: customerId._id, // ID người đặt
      vnp_CustomerName: customerName, // Tên người đặt
      vnp_CustomerEmail: customerEmail, // Email người đặt
    };

    // Tạo chuỗi yêu cầu và ký nó
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", config.vnp_HashSecret); // Lấy key bảo mật từ cấu hình
    const signed = hmac.update(signData).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán VNPay
    const paymentUrl = config.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

    // Trả về URL thanh toán
    res.json({ paymentUrl });
  } catch (error) {
    console.error("Lỗi khi tạo URL thanh toán:", error);
    res.json({ paymentUrl });

    res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});

module.exports = router;
