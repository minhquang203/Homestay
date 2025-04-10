require("dotenv").config();

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const moment = require("moment");
const querystring = require("qs");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

router.post("/create_payment_url", async (req, res) => {
  try {
    const { bookingId, totalPrice, customerId, bankCode } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!bookingId || !totalPrice || !customerId) {
      return res.status(400).json({ message: "Thông tin không đầy đủ" });
    }

    console.log(req.body);

    // Kiểm tra trạng thái của đơn đặt phòng
    const booking = await Booking.findById(bookingId).populate("listingId");
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }
    if (booking.status !== "approved") {
      return res.status(400).json({ message: "Đơn đặt phòng chưa được duyệt" });
    }

    // Kiểm tra số tiền có khớp không
    if (Number(totalPrice) !== Number(booking.totalPrice)) {
      return res.status(400).json({ message: "Số tiền không khớp với đơn đặt phòng" });
    }

    // Kiểm tra người đặt có trùng khớp không
    if (String(customerId) !== String(booking.customerId)) {
      return res.status(403).json({ message: "Người đặt không hợp lệ" });
    }

    // Tạo bản ghi Payment
    const newPayment = new Payment({
      bookingId,
      customerId,
      amount: totalPrice,
      paymentMethod: "VNPay",
      status: "pending",
    });
    await newPayment.save();

    // Tạo URL thanh toán VNPay
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    if (!secretKey) {
      throw new Error("VNP_HASH_SECRET không được định nghĩa");
    }

    const orderId = date.getTime().toString();
    const orderInfo = `Thanh toán cho chuyến đi ${bookingId}`;
    const ordertotalPrice = Number(totalPrice) * 100;

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: "other",
      vnp_Amount: ordertotalPrice,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    const paymentUrl = vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

    // Cập nhật transactionId vào Payment
    newPayment.transactionId = orderId;
    await newPayment.save();

    res.json({ paymentUrl, paymentId: newPayment._id });
  } catch (err) {
    console.error("Lỗi khi tạo URL thanh toán:", err);
    res.status(500).json({ message: "Lỗi server. Vui lòng thử lại sau.", error: err.message });
  }
});
// Route xử lý callback từ VNPay
router.get("/vnpay_return", async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return res.status(400).json({ message: "Chữ ký không hợp lệ" });
    }

    const transactionId = vnp_Params["vnp_TxnRef"];
    const responseCode = vnp_Params["vnp_ResponseCode"];

    // Tìm bản ghi Payment
    const payment = await Payment.findOne({ transactionId }).populate("bookingId");
    if (!payment) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    // Cập nhật trạng thái thanh toán
    if (responseCode === "00") {
      // Thanh toán thành công
      payment.status = "completed";
      payment.bookingId.paymentStatus = "completed";
      payment.bookingId.status = "completed"; // Cập nhật trạng thái Booking
    } else {
      // Thanh toán thất bại
      payment.status = "failed";
      payment.bookingId.paymentStatus = "failed";
    }

    await payment.save();
    await payment.bookingId.save();

    // Chuyển hướng người dùng về trang kết quả
    res.redirect(`${process.env.FRONTEND_URL}/payment-result?status=${payment.status}`);
  } catch (err) {
    console.error("Lỗi khi xử lý callback VNPay:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// Hàm sắp xếp các tham số trong đối tượng
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

module.exports = router;