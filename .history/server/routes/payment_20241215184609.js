const express = require('express');
const crypto = require('crypto');
const querystring = require('qs');
const router = express.Router();
const Booking = require("../models/Booking");

// Import cấu hình từ file vnpayConfig.js
const config = require('../config/vnpayConfig');

// API để tạo URL thanh toán
router.post('/create_payment_url', function (req, res) {
    const { customerId, orderInfo, totalPrice } = req.body;
  
    if (!customerId || !orderInfo || !totalPrice) {
      return res.status(400).json({ error: "Thông tin không đầy đủ." });
    }
  
    const ipAddr = req.ip;  // Địa chỉ IP của người dùng
    const date = new Date();
    const createDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Định dạng thời gian cho yêu cầu
    const orderId = Date.now(); // Mã đơn hàng dựa trên thời gian hiện tại
  
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: config.vnp_TmnCode, // Lấy mã TMN từ cấu hình
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_Amount: totalPrice * 100,  // VNPay yêu cầu số tiền tính theo đơn vị "VND"
      vnp_ReturnUrl: config.vnp_ReturnUrl, // Lấy URL trả về từ cấu hình
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };
  
    // Tạo chuỗi yêu cầu và ký nó
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", config.vnp_HashSecret); // Lấy key bảo mật từ cấu hình
    const signed = hmac.update(signData).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
  
    const paymentUrl = config.vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });
  
    // Trả về URL thanh toán
    res.json({ paymentUrl });
  });
  

module.exports = router;
