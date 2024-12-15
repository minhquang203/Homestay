// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const qs = require('qs');
const config = require('../config/vnpayConfig');
const dateFormat = require('dateformat');

// API tạo URL thanh toán VNPay
router.post('/create_payment_url', (req, res) => {
  const { amount, orderInfo } = req.body;

  const tmnCode = config.get('vnp_TmnCode'); // TmnCode
  const secretKey = config.get('vnp_HashSecret'); // HashSecret
  const vnpUrl = config.get('vnp_Url'); // URL thanh toán VNPay
  const returnUrl = config.get('vnp_ReturnUrl'); // URL quay lại sau thanh toán

  const date = new Date();
  const createDate = dateFormat(date, 'yyyymmddHHmmss'); // Ngày giờ tạo đơn hàng
  const orderId = dateFormat(date, 'HHmmss'); // Mã đơn hàng

  const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Tham số VNPay
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_Amount: amount * 100, // VNPay yêu cầu tiền tệ là VND, nên nhân với 100
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate
  };

  vnp_Params = sortObject(vnp_Params);

  // Chuẩn bị dữ liệu chữ ký
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  const paymentUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

  // Trả về URL thanh toán
  res.json({ paymentUrl });
});

// Hàm sắp xếp các tham số theo thứ tự chữ cái
const sortObject = (obj) => {
  let sortedKeys = Object.keys(obj).sort();
  let sortedObj = {};
  for (let key of sortedKeys) {
    sortedObj[key] = obj[key];
  }
  return sortedObj;
};

module.exports = router;
