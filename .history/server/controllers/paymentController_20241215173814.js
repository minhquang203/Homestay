// controllers/paymentController.js
const crypto = require("crypto");
const querystring = require("querystring");
const config = require("../config/vnpayConfig");
const Booking = require("../models/Booking");

exports.createPaymentUrl = async (req, res) => {
  const { bookingId } = req.body; // Nhận bookingId từ frontend

  try {
    // Tìm booking từ database
    const booking = await Booking.findById(bookingId).populate('listingId'); // Populate để lấy thông tin listingId nếu cần thiết

    if (!booking) {
      return res.status(400).json({ message: "Không tìm thấy booking" });
    }

    // Lấy thông tin cần thiết từ booking
    const amount = booking.totalPrice;
    const orderInfo = `Thanh toán cho chuyến đi ${booking.listingId.name}`; // Sử dụng tên listingId nếu có

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

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo URL thanh toán" });
  }
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
  return sorted;
}
