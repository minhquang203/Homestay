require('dotenv').config();
const router = require('express').Router();
const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');

router.post('/create_payment_url', function (req, res, next) {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let tmnCode = process.env.VNP_TMN_CODE;
  let secretKey = process.env.VNP_HASH_SECRET;
  let vnpUrl = process.env.VNP_URL;
  let returnUrl = process.env.VNP_RETURN_URL;
  
  let { amount, bankCode, userId } = req.body; // Nhận userId từ frontend

  if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
    return res.status(500).json({ message: "Cấu hình VNPay không đầy đủ trong file .env" });
  }

  if (!userId) {
    return res.status(400).json({ message: "Thiếu thông tin người dùng" });
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Số tiền không hợp lệ" });
  }

  let orderId = moment(date).format('DDHHmmss');
  let locale = 'vn';
  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toán cho mã GD:' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = `${returnUrl}?userId=${userId}`; // Gắn userId vào returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  if (bankCode && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  res.json({ paymentUrl: vnpUrl });
});

function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
};

router.get('/vnpay_return', function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];
  let userId = vnp_Params['userId']; // Lấy userId từ query

  if (!userId) {
    return res.redirect("http://localhost:3000/trips?error=Thiếu thông tin người dùng");
  }

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = process.env.VNP_HASH_SECRET;
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    let transactionStatus = vnp_Params['vnp_TransactionStatus'];

    if (transactionStatus === '00') {
      return res.redirect(`http://localhost:3000/${userId}/reservations`);
    } else {
      return res.redirect(`http://localhost:3000/${userId}/trips?error=Thanh toán thất bại`);
    }
  } else {
    return res.redirect("http://localhost:3000/trips?error=Chữ ký không hợp lệ");
  }
});

module.exports = router;
