const router = require('express').Router();
const Booking = require("../models/Booking");

/* Tạo Booking */
router.post("/create", async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;
    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice });
    await newBooking.save();
    res.status(200).json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Tạo Đơn thất bại!", error: err.message });
  }
});
// Route để lấy thông tin Booking (đã có từ yêu cầu trước)
router.get("/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
      .populate('customerId', 'name email')
      .populate('hostId', 'name email')
      .populate('listingId', 'title');

    if (!booking) {
      return res.status(404).json({ message: "Booking không tồn tại." });
    }

    res.json(booking);
  } catch (err) {
    console.error('🔥 Lỗi khi lấy thông tin booking:', err);
    res.status(500).json({ message: "Lỗi server. Vui lòng thử lại sau.", error: err.message });
  }
});

module.exports = router;
