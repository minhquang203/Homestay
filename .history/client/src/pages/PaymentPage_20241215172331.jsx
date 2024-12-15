import axios from "axios";
import React, { useState } from "react";

function PaymentPage() {
  const [paymentUrl, setPaymentUrl] = useState("");

  const handlePayment = async () => {
    try {
      // Gửi yêu cầu đến backend để tạo URL thanh toán
      const response = await axios.post("http://localhost:3002/payment/create_payment_url", {
        amount: 100000, // Số tiền bạn muốn thanh toán
        orderInfo: "Thanh toán dịch vụ HomeStay",
      });

      // Nhận URL thanh toán từ VNPay
      const { paymentUrl } = response.data;

      // Chuyển hướng người dùng đến cổng thanh toán
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán", error);
    }
  };

  return (
    <div>
      <h1>Trang thanh toán</h1>
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
}

export default PaymentPage;
