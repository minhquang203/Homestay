// paymentController.js
const crypto = require('crypto');
const querystring = require('querystring');
const config = require('../config/vnpayConfig');

exports.createPaymentUrl = (req, res) => {
  const { amount, orderInfo } = req.body;
  
  if (!amount || !orderInfo) {
    return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
  }

  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-T:\.Z]/g, "")
    .slice(0, 14);
  const orderId = `${date.getTime()}`; // ID đơn hàng duy nhất
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: config.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // Sắp xếp các tham số theo thứ tự
  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params);
  const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const paymentUrl = `${config.vnp_Url}?${querystring.stringify(vnp_Params)}`;
  res.json({ paymentUrl });
};

// Hàm sắp xếp các tham số theo thứ tự
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

exports.paymentC
