const mongoose = require("mongoose");
const Booking = require("./Booking");

const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionId: { type: String, required: true },
  paymentMethod: { type: String, default: "VNPAY" },
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

paymentSchema.pre('save', async function(next) {
  const payment = this;
  const booking = await Booking.findById(payment.bookingId);
  if (!booking) {
    return next(new Error('Booking not found'));
  }
  if (payment.amount !== booking.totalPrice) {
    return next(new Error('Payment amount does not match booking total price'));
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);