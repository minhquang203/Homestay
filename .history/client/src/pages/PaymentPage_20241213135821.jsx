// PaymentPage.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const { listingId, totalPrice, startDate, endDate } = location.state || {};
  const [paymentUrl, setPaymentUrl] = useState("");

  useEffect(() => {
    if (!listingId || !totalPrice) {
      alert("No payment information found!");
      return;
    }

    // Gửi yêu cầu thanh toán đến backend
    axios.post("http://localhost:3002/payment/momo", {
      amount: totalPrice,
      orderInfo: `Payment for listing ${listingId}`,
      redirectUrl: "http://localhost:3000/payment/success",
      ipnUrl: "http://localhost:3000/payment/ipn"
    })
    .then(response => {
      if (response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl); // Nhận URL thanh toán
      } else {
        alert("Payment request failed");
      }
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
  }, [listingId, totalPrice]);

  return (
    <div>
      <h2>Thanh toán cho chuyến đi</h2>
      <p>Listing ID: {listingId}</p>
      <p>Tổng số tiền: {totalPrice} VND</p>
      <p>Thời gian: {startDate} - {endDate}</p>

      {/* Nếu có paymentUrl, hiển thị nút thanh toán */}
      {paymentUrl && (
        <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
          Thanh toán qua MoMo
        </a>
      )}
    </div>
  );
};

export default PaymentPage;
