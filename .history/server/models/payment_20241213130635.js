const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // ID giao dịch
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người thanh toán
  amount: { type: Number, required: true }, // Số tiền thanh toán
  status: { type: String, default: "pending" }, // Trạng thái giao dịch
  momoResponse: { type: Object, default: null }, // Phản hồi từ MoMo
  createdAt: { type: Date, default: Date.now }, // Thời điểm tạo
});

module.exports = mongoose.model("Payment", paymentSchema);
