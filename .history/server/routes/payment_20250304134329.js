require('dotenv').config(); // Load biến môi trường từ file .env
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');

router.post('/create_payment_url', async (req, res) => {
  try {
    console.log("📌 Dữ liệu nhận được:", req.body);
    const { totalPrice, customerId, hostId, bankCode } = req.body;

    // Kiểm tra đầu vào
    if (!totalPrice || !customerId || !hostId) {
      return res.status(400).json({ message: "❌ Thiếu thông tin bắt buộc!" });
    }

    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const currentDate = new Date();
    const createDate = moment(currentDate).format('YYYYMMDDHHmmss');
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket?.remoteAddress;

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      return res.status(500).json({ message: "❌ Cấu hình VNPAY chưa được thiết lập đầy đủ." });
    }

    const orderId = currentDate.getTime().toString(); // ID đơn hàng duy nhất
    const orderInfo = `Thanh toán từ khách hàng ${customerId} cho chủ nhà ${hostId}`;
    const orderAmount = parseInt(totalPrice) * 100; // Nhân với 100 để chuyển thành đơn vị VND

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

    vnp_Params = sortObject(vnp_Params); // Sắp xếp tham số theo thứ tự alphabet

    // Tạo chuỗi ký số
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;

    console.log("✅ URL thanh toán:", paymentUrl);

    // Trả về URL thanh toán cho frontend
    res.json({ paymentUrl });

  } catch (err) {
    console.error('🔥 Lỗi khi tạo URL thanh toán:', err);
    res.status(500).json({ message: "❌ Lỗi server. Vui lòng thử lại sau.", error: err.message });
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
