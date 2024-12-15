// routes/payment.js
const express = require('express');
const crypto = require('crypto');
const querystring = require('qs');
const dateFormat = require('dateformat');
const config = require('../config/vnpayConfig');

const router = express.Router();

router.post('/create_payment_url', (req, res) => {
  const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const date = new Date();
  
  const createDate = dateFormat(date, 'yyyymmddHHmmss'); // Thời gian tạo
  const orderId = dateFormat(date, 'HHmmss'); // ID đơn hàng (mã giao dịch)
  const amount = req.body.amount;
  const orderInfo = req.body.orderInfo;
  const orderType = req.body.orderType || "billpayment"; // Loại giao dịch
  const locale = req.body.locale || "vn"; // Ngôn ngữ, mặc định là tiếng Việt
  const currCode = 'VND'; // Tiền tệ
  
  const vnp_Params = {
    vnp_Version: '2.1.0', // Phiên bản VNPay API
    vnp_Command: 'pay', // Loại yêu cầu thanh toán
    vnp_TmnCode: config.vnp_TmnCode, // Mã TMN
    vnp_Locale: locale, // Ngôn ngữ
    vnp_CurrCode: currCode, // Tiền tệ
    vnp_TxnRef: orderId, // Mã giao dịch
    vnp_OrderInfo: orderInfo, // Thông tin đơn hàng
    vnp_OrderType: orderType, // Loại giao dịch
    vnp_Amount: amount * 100, // Số tiền (VNPay yêu cầu tính bằng "hào", 100 VND = 1 đơn vị)
    vnp_ReturnUrl: config.vnp_ReturnUrl, // URL trả về sau khi thanh toán
    vnp_IpAddr: ipAddr, // Địa chỉ IP
    vnp_CreateDate: createDate, // Thời gian tạo giao dịch
  };

  // Nếu có chọn ngân hàng
  if (req.body.bankCode) {
    vnp_Params['vnp_BankCode'] = req.body.bankCode;
  }

  // Sắp xếp các tham số theo thứ tự chuẩn
  const sortedParams = sortObject(vnp_Params);

  // Tạo chuỗi dữ liệu để mã hóa
  const signData = querystring.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  // Thêm trường SecureHash vào tham số
  sortedParams['vnp_SecureHash'] = signed;

  // Tạo URL thanh toán VNPay
  const vnpUrl = config.vnp_Url + '?' + querystring.stringify(sortedParams, { encode: false });

  // Gửi URL thanh toán về client
  res.json({ paymentUrl: vnpUrl });
});

// Hàm sắp xếp các tham số theo thứ tự chuẩn (alphabetically)
function sortObject(obj) {
  const sortedObj = {};
  Object.keys(obj).sort().forEach(function(key) {
    sortedObj[key] = obj[key];
  });
  return sortedObj;
}

module.exports = router;
