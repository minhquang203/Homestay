import axios from "axios";
import React, { useState } from "react";

const PaymentPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");

  // Hàm xử lý gửi yêu cầu thanh toán
  const handlePayment = async () => {
    try {
      // Gửi yêu cầu POST tới backend để tạo URL thanh toán
      const response = await axios.post("http://localhost:3002/payment/create_payment_url", {
        bookingId: bookingId,
      });

      // Nhận paymentUrl từ backend
      if (response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
      }
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
    }
  };

  // Hàm chuyển hướng người dùng tới VNPay
  const redirectToVNPay = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl; // Chuyển hướng người dùng tới VNPay
    }
  };

  return (
    <div className="payment-container">
      <h1>Thanh toán chuyến đi</h1>
      <div>
        <label>Booking ID: </label>
        <input
          type="text"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          placeholder="Nhập Booking ID"
        />
      </div>
      <button onClick={handlePayment}>Tạo URL thanh toán</button>

      {paymentUrl && (
        <div>
          <button onClick={redirectToVNPay}>Chuyển hướng tới VNPay</button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
