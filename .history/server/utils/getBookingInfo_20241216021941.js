const mongoose = require("mongoose");
const Booking = require('../models/Booking');  // Đảm bảo bạn đã import đúng mô hình Booking

const getBookingInfo = async (userId, listingId) => {
  try {
    const userObjectId = mongoose.Types.ObjectId(userId);
    const listingObjectId = mongoose.Types.ObjectId(listingId);

    // Tìm booking dựa trên userId và listingId
    const booking = await Booking.findOne({ customerId: userObjectId, listingId: listingObjectId })
      .populate('listingId')  // Lấy thông tin chi tiết từ Listing
      .exec();

    if (!booking) {
      throw new Error("Không tìm thấy thông tin đặt phòng.");
    }

    return booking;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đặt phòng:', error);
    throw new Error("Lỗi khi lấy thông tin đặt phòng.");
  }
};

module.exports = getBookingInfo;
