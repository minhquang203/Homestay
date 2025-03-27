const Booking = require('../models/Booking');

const getBookingInfo = async (userId, listingId) => {
  try {
    if (!userId || !listingId) {
      throw new Error('userId hoặc listingId không hợp lệ.');
    }

    const booking = await Booking.findOne({ customerId: userId, listingId: listingId }).exec();

    if (!booking) {
      throw new Error('Không tìm thấy thông tin đặt phòng.');
    }

    return booking;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đặt phòng:', error.message);
    throw new Error('Lỗi khi lấy thông tin đặt phòng.');
  }
};

module.exports = { getBookingInfo };
