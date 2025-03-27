const router = require("express").Router();
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const User = require("../models/User");

// Middleware xác thực (giả sử bạn có middleware để kiểm tra người dùng đăng nhập)
const authenticate = (req, res, next) => {
  const loggedInUserId = req.user?._id;
  const { customerId } = req.body;

  if (!loggedInUserId || loggedInUserId.toString() !== customerId) {
    return res.status(403).json({ message: "Bạn không có quyền tạo đơn đặt phòng này" });
  }
  next();
};

// Tạo đơn đặt phòng
router.post("/create", authenticate, async (req, res) => {
  try {
    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!customerId || !hostId || !listingId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ message: "Thông tin không đầy đủ" });
    }

    // Kiểm tra Listing có tồn tại không
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Không tìm thấy tin đăng" });
    }

    // Kiểm tra hostId có tồn tại không
    const host = await User.findById(hostId);
    if (!host) {
      return res.status(404).json({ message: "Không tìm thấy host" });
    }

    // Kiểm tra hostId có khớp với creator của Listing không
    if (listing.creator.toString() !== hostId) {
      return res.status(400).json({ message: "hostId không khớp với người tạo tin đăng" });
    }

    // Kiểm tra thời gian đặt phòng có hợp lệ không
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = (end - start) / (1000 * 60 * 60 * 24);
    if (days <= 0) {
      return res.status(400).json({ message: "Ngày không hợp lệ" });
    }

    // Kiểm tra xem thời gian đặt phòng có bị trùng không
    const overlappingBookings = await Booking.find({
      listingId,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
      status: { $nin: ["cancelled", "completed"] },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: "Thời gian đặt phòng đã được đặt bởi người khác" });
    }

    // Kiểm tra totalPrice có khớp không
    const calculatedPrice = listing.price * days;
    if (Math.abs(calculatedPrice - totalPrice) > 1) {
      return res.status(400).json({ message: "Tổng số tiền không khớp với giá của tin đăng" });
    }

    // Tạo đơn đặt phòng mới
    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
    });

    await newBooking.save();

    res.status(200).json(newBooking);
  } catch (err) {
    console.error("Lỗi khi tạo đơn đặt phòng:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;