import React from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const { trip } = location.state;  // Lấy thông tin chuyến đi từ state

  const handlePayment = () => {
    // Gọi API để xử lý thanh toán ở đây
    alert('Thanh toán thành công!');
  };

  return (
    <div className="payment-page">
      <h1>Thanh toán cho chuyến đi</h1>
      <div>
        <h2>{trip.listingId.category}</h2>
        <p>Địa chỉ: {trip.listingId.city}, {trip.listingId.province}, {trip.listingId.country}</p>
        <p>Ngày bắt đầu: {new Date(trip.startDate).toLocaleDateString()}</p>
        <p>Ngày kết thúc: {new Date(trip.endDate).toLocaleDateString()}</p>
        <p>Tổng giá: {trip.totalPrice} VND</p>
        <button onClick={handlePayment}>Thanh toán</button>
      </div>
    </div>
  );
};

export default PaymentPage;
