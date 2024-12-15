const express = require("express");
const router = express.Router();
const crypto = require("crypto");  // Dùng để mã hóa thông tin để tạo chữ ký cho cổng VNPay
const querystring = require("querystring");

// Các thông tin cấu hình từ VNPay
const VNPAY_CONFIG = {
  VNP_TmnCode: "YOUR_TMN_CODE", // Thay thế bằng mã của bạn
  VNP_HashSecret: "YOUR_SECRET_KEY", // Thay thế bằng secret key của bạn
  VNP_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // URL thanh toán sandbox của VNPay
  VNP_ReturnUrl: "http://localhost:3002/callback", // URL trả kết quả sau khi thanh toán
  VNP_API_URL: "https://sandbox.vnpayment.vn/merchant_webapi/transaction", // API VNPay
};

// Hàm tạo chữ ký cho VNPay
const createVnpaySignature = (params) => {
  const query = querystring.stringify(params, null, null, {
    encodeURIComponent: (str) => str,
  });
  return crypto
    .createHmac("sha512", VNPAY_CONFIG.VNP_HashSecret)
    .update(query)
    .digest("hex")
    .toUpperCase();
};

// API tạo URL thanh toán VNPay
router.post("/create_payment_url", (req, res) => {
  const { amount, orderInfo, orderId } = req.body; // Lấy thông tin thanh toán từ client
  
  const date = new Date();
  const vnp_TxnRef = orderId;  // Dùng orderId làm mã giao dịch
  const vnp_OrderInfo = orderInfo; // Thông tin về đơn hàng
  const vnp_Amount = amount * 100;  // VNPay yêu cầu số tiền là VND x 100
  const vnp_Locale = "vn"; // Ngôn ngữ trả về
  const vnp_BankCode = ""; // Nếu có lựa chọn ngân hàng thì thêm mã ngân hàng vào đây

  // Tạo đối tượng params cho VNPay
  const params = {
    vnp_Version: "2.1.0",
    vnp_TmnCode: VNPAY_CONFIG.VNP_TmnCode,
    vnp_Amount: vnp_Amount,
    vnp_Command: "pay",
    vnp_CreateDate: date.toISOString().replace(/[-:]/g, "").split(".")[0],  // Thời gian tạo giao dịch
    vnp_CurrCode: "VND",
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: vnp_OrderInfo,
    vnp_Locale: vnp_Locale,
    vnp_ReturnUrl: VNPAY_CONFIG.VNP_ReturnUrl,
    vnp_IpAddr: req.ip,  // Địa chỉ IP của người dùng
  };

  // Tạo chữ ký
  const signature = createVnpaySignature(params);
  params.vnp_SecureHash = signature;

  // Tạo URL thanh toán VNPay
  const paymentUrl = `${VNPAY_CONFIG.VNP_Url}?${querystring.stringify(params)}`;

  // Trả về URL thanh toán cho client
  res.json({ paymentUrl });
});

// API callback của thanh toán VNPay (để nhận kết quả thanh toán)
router.get("/callback", (req, res) => {
  const secureHash = req.query.vnp_SecureHash;
  const params = req.query;

  // Loại bỏ tham số không cần thiết trong params để tính chữ ký
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const signature = createVnpaySignature(params);

  if (signature === secureHash) {
    if (params.vnp_ResponseCode === "00") {
      // Thanh toán thành công
      res.json({ message: "Thanh toán thành công!" });
    } else {
      // Thanh toán thất bại
      res.json({ message: "Thanh toán không thành công. Vui lòng thử lại." });
    }
  } else {
    res.json({ message: "Lỗi chữ ký. Không xác minh được." });
  }
});

module.exports = router;
