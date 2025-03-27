const BookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" } // ✅ Thêm trạng thái thanh toán
  },
  { timestamps: true }
);
