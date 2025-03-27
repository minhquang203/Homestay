const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

// Tạo đơn đặt phòng
router.post("/create", async (req, res) => {
  try {
    const { customerId, listingId, startDate, endDate } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!customerId || !listingId || !startDate || !endDate) {
      return res.status(400).json({ message: "Thông tin không đầy đủ" });
    }

    // Kiểm tra Listing có tồn tại không
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Không tìm thấy tin đăng" });
    }

    // Tính tổng số ngày và tổng số tiền
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = (end - start) / (1000 * 60 * 60 * 24); // Số ngày
    if (days <= 0) {
      return res.status(400).json({ message: "Ngày không hợp lệ" });
    }

    const totalPrice = listing.price * days; // Tổng tiền = giá Listing * số ngày

    // Tạo đơn đặt phòng mới
    const newBooking = new Booking({
      customerId,
      hostId: listing.creator, // Lấy hostId từ creator của Listing
      listingId,
      startDate,
      endDate,
      totalPrice,
      status: "pending", // Chờ duyệt
      paymentStatus: "pending", // Chưa thanh toán
    });

    await newBooking.save();

    res.status(200).json(newBooking);
  } catch (err) {
    console.error("Lỗi khi tạo đơn đặt phòng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;