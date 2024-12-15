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
// Xóa chuyến đi trong cơ sở dữ liệu (Mongoose)
router.delete('/users/:userId/trips/:listingId/cancel', async (req, res) => {
  const { userId, listingId } = req.params;

  try {
    // Đảm bảo cả userId và listingId đều được cung cấp
    if (!userId || !listingId) {
      return res.status(400).json({ message: "User ID và Listing ID là bắt buộc" });
    }

    // Tìm và xóa chuyến đi
    const trip = await Booking.findOneAndDelete({ customerId: userId, listingId });

    if (!trip) {
      return res.status(404).json({ message: "Không tìm thấy chuyến đi" });
    }

    return res.status(200).json({ message: "Hủy chuyến đi thành công", trip });
  } catch (err) {
    console.error("Lỗi khi hủy chuyến đi:", err.message);
    return res.status(500).json({ message: "Lỗi khi hủy chuyến đi", error: err.message });
  }
});



module.exports = router;