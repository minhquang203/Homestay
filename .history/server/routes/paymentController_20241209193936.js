const Payment = require("../models/paymentModel"); // Import model thanh toán

// API để tạo đơn thanh toán
const createPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, paymentUrl } = req.body;

    // Tạo mới một bản ghi thanh toán
    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentUrl,
      status: "pending", // Trạng thái ban đầu là pending
    });

    // Lưu thông tin thanh toán vào MongoDB
    await payment.save();

    res.status(201).json({ paymentUrl, message: "Đơn thanh toán đã được tạo" });
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    res.status(500).json({ message: "Lỗi khi tạo thanh toán" });
  }
};

// API để cập nhật trạng thái thanh toán (sau khi thanh toán thành công hoặc thất bại)
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Cập nhật trạng thái thanh toán dựa trên orderId
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Thanh toán không tìm thấy" });
    }

    res.status(200).json({ payment, message: "Cập nhật trạng thái thanh toán thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái thanh toán" });
  }
};

module.exports = { createPayment, updatePaymentStatus };
