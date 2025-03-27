const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Chủ đăng chỗ
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người thuê
  transactionId: { type: String, required: true }, // Mã giao dịch
  paymentMethod: { type: String, default: "VNPAY" }, // Phương thức thanh toán
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" }, // Trạng thái
  amount: { type: Number, required: true }, // Số tiền thanh toán
  createdAt: { type: Date, default: Date.now }, // Thời gian thanh toán
});

module.exports = mongoose.model("Payment", paymentSchema);
