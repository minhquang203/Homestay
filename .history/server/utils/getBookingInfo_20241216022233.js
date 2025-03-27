const getBookingInfo = async (userId, listingId) => {
    try {
      // Kiểm tra kết nối và truy vấn trong DB
      console.log(`Đang truy vấn booking với userId: ${userId}, listingId: ${listingId}`);
      const booking = await Booking.findOne({ customerId: userId, listingId: listingId }).exec();
      if (!booking) {
        throw new Error("Không tìm thấy thông tin đặt phòng.");
      }
      console.log('Thông tin đặt phòng:', booking);
      return booking;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đặt phòng:', error);
      throw new Error("Lỗi khi lấy thông tin đặt phòng.");
    }
  };
  