const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Liên kết với Booking
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với User
      required: true,
    },
    amount: {
      type: Number,
      required: true, // Số tiền thanh toán
    },
    paymentMethod: {
      type: String,
      enum: ["VNPay", "Cash", "BankTransfer"], // Phương thức thanh toán
      required: true,
    },
    transactionId: {
      type: String, // ID giao dịch từ VNPay
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"], // Trạng thái thanh toán
      default: "pending",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;