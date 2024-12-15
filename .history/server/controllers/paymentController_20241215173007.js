// paymentController.js
const crypto = require("crypto");
const querystring = require("querystring");
// Nếu controller nằm trong thư mục controllers
const paymentController = require("../controllers/paymentController"); // Đảm bảo đường dẫn này đúng

const config = require("../config/vnpayConfig"); // Đảm bảo rằng bạn đã có cấu hình VNPay ở đây

exports.createPaymentUrl = (req, res) => {
  const { tripId } = req.body; // Nhận tripId từ frontend

  // Giả sử bạn có thông tin chuyến đi từ cơ sở dữ liệu
  const trip = getTripById(tripId); // Bạn cần thay thế hàm này để lấy thông tin chuyến đi từ DB

  if (!trip) {
    return res.status(400).json({ error: "Chuyến đi không tồn tại" });
  }

  const { amount, orderInfo } = trip; // Lấy thông tin chuyến đi như số tiền, thông tin đơn hàng

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

// Hàm giả lập lấy thông tin chuyến đi từ DB
const getTripById = (tripId) => {
  // Thay thế bằng việc truy vấn cơ sở dữ liệu thực tế
  return {
    amount: 100000, // Số tiền thanh toán, ví dụ 100.000 VND
    orderInfo: `Thanh toán cho chuyến đi ${tripId}`, // Thông tin đơn hàng
  };
};

// Hàm sắp xếp các tham số theo thứ tự alphabet
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}
