const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với User (người đặt phòng)
      required: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết với User (người tạo tin đăng - host)
      required: true,
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing", // Liên kết với Listing (tin đăng)
      required: true,
    },
    startDate: {
      type: Date,
      required: true, // Ngày bắt đầu đặt phòng
    },
    endDate: {
      type: Date,
      required: true, // Ngày kết thúc đặt phòng
    },
    totalPrice: {
      type: Number,
      required: true, // Tổng số tiền (tính dựa trên giá Listing và số ngày)
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "completed"], // Trạng thái đơn đặt phòng
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"], // Trạng thái thanh toán
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;