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


module.exports = router;
