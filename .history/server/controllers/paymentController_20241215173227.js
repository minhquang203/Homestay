// controllers/paymentController.js
const crypto = require("crypto");
const querystring = require("querystring");
const config = require("../config/vnpayConfig");

exports.createPaymentUrl = (req, res) => {
  const { amount, orderInfo } = req.body;

  if (!amount || !orderInfo) {
    return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
  }

  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-T:\.Z]/g, "")
    .slice(0, 14); // Định dạng thời gian
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
    vnp_OrderType: "other", // Loại hàng hóa
    vnp_Amount: amount * 100, // VNPay nhận giá trị *100
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

// API Callback của thanh toán
exports.paymentCallback = (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const signData = querystring.stringify(vnp_Params);
  const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    // Nếu mã chữ ký hợp lệ, trả về kết quả thanh toán thành công
    res.json({ message: "Thanh toán thành công!" });
  } else {
    // Nếu mã chữ ký không hợp lệ, trả về lỗi
    res.status(400).json({ message: "Thanh toán không hợp lệ!" });
  }
};

// Hàm sắp xếp các tham số theo thứ tự
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
//   // paymentController.js
// exports.createPaymentUrl = (req, res) => {
//     const { tripId } = req.body; // Nhận tripId từ frontend
  
//     // Giả sử bạn có thông tin chuyến đi từ cơ sở dữ liệu
//     // Tìm chuyến đi trong DB (đây chỉ là ví dụ, bạn cần lấy thông tin trip từ DB)
//     const trip = getTripById(tripId);
  
//     if (!trip) {
//       return res.status(400).json({ error: "Chuyến đi không tồn tại" });
//     }
  
//     const { amount, orderInfo } = trip; // Lấy thông tin chuyến đi như số tiền, thông tin đơn hàng
  
//     // Tiếp tục tạo URL thanh toán giống như trước
//     const paymentUrl = createPaymentUrl(amount, orderInfo);
  
//     res.json({ paymentUrl });
//   };
  
//   // Hàm giả lập lấy thông tin chuyến đi từ DB
//   const getTripById = (tripId) => {
//     // Lấy thông tin chuyến đi từ cơ sở dữ liệu, ví dụ:
//     return {
//       amount: 100000, // Ví dụ số tiền thanh toán
//       orderInfo: `Thanh toán cho chuyến đi ${tripId}`,
//     };
//   };
  
  return sorted;
}
