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
// Tạo chuyến đi mới
router.post("/create_trip", async (req, res) => {
  try {
    const { name, destination, price, startDate, endDate, description } = req.body;

    const newTrip = new Trip({
      name,
      destination,
      price,
      startDate,
      endDate,
      description,
    });

    await newTrip.save();

    res.status(201).json({ message: "Chuyến đi đã được tạo", trip: newTrip });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi tạo chuyến đi." });
  }
});

// Lấy tất cả chuyến đi
router.get("/get_all_trips", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy danh sách chuyến đi." });
  }
});

module.exports = router;
