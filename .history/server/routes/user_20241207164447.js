const router = require("express").Router()

const Booking = require("../models/Booking")
const User = require("../models/User")
const Listing = require("../models/Listing")

/* GET TRIP LIST */

router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params
    const trips = await Booking.find({ customerId: userId }).populate("customerId hostId listingId")
    res.status(202).json(trips)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Ca  not find trips!", error: err.message })
  }
})
/* ADD LISTING TO WISHLIST */
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params
    const user = await User.findById(userId)
    const listing = await Listing.findById(listingId).populate("creator")

    const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId)

    if (favoriteListing) {
      user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId)
      await user.save()
      res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList})
    } else {
      user.wishList.push(listing)
      await user.save()
      res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList})
    }
  } catch (err) {
    console.log(err)
    res.status(404).json({ error: err.message })
  }
})
/* GET PROPERTY LIST */
router.get("/:userId/properties", async (req, res) => { 
  try {
    const { userId } = req.params
    const properties = await Listing.find({ creator: userId }).populate("creator")
    res.status(202).json(properties)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find properties!", error: err.message })
  }
})
/* GET RESERVATION LIST */
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params
    const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
    res.status(202).json(reservations)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find reservations!", error: err.message })
  }
})
router.patch("/:userId/:listingId/cancel", async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    // Tìm người dùng và chuyến đi tương ứng
    const user = await User.findById(userId);
    const trip = await Booking.findOne({ customerId: userId, listingId }).populate("listingId");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Kiểm tra nếu chuyến đi đã bị hủy
    if (trip.status === 'canceled') {
      return res.status(400).json({ message: "Trip is already canceled" });
    }

    // Cập nhật trạng thái chuyến đi thành 'canceled'
    trip.status = 'canceled';
    await trip.save();

    // Xóa chuyến đi khỏi danh sách chuyến đi của người dùng trong Redux hoặc MongoDB
    user.tripList = user.tripList.filter((trip) => trip.listingId.toString() !== listingId);
    await user.save();

    res.status(200).json({ message: "Trip canceled successfully", trip });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error canceling trip", error: err.message });
  }
});




module.exports = router;