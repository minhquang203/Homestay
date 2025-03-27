const router = require("express").Router()

const Booking = require("../models/Booking")
const User = require("../models/User")
const Listing = require("../models/Listing")

/* GET TRIP LIST */

router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm tất cả Booking của userId và populate thông tin từ Listing
    const trips = await Booking.find({ customerId: userId })
      .populate("listingId") // Chỉ cần populate listingId
      .populate("hostId") // Populate hostId để lấy thông tin host (nếu cần)
      .exec();

    // Kiểm tra nếu không có chuyến đi nào
    if (!trips || trips.length === 0) {
      return res.status(200).json([]);
    }

    // Định dạng dữ liệu để trả về cho frontend
    const formattedTrips = trips.map((trip) => ({
      listingId: {
        _id: trip.listingId._id,
        listingPhotoPaths: trip.listingId.listingPhotoPaths,
        city: trip.listingId.city,
        province: trip.listingId.province,
        country: trip.listingId.country,
        category: trip.listingId.category,
      },
      hostId: {
        _id: trip.hostId._id, // Lấy trực tiếp từ hostId
      },
      startDate: trip.startDate,
      endDate: trip.endDate,
      totalPrice: trip.totalPrice,
      status: trip.status,
      paymentStatus: trip.paymentStatus,
    }));

    res.status(200).json(formattedTrips);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách chuyến đi:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});
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




module.exports = router;