// src/pages/PaymentPage.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function PaymentPage() {
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    // Gửi yêu cầu đến backend để nhận URL thanh toán MoMo
    axios
      .post('http://localhost:3002/payment/momo', {
        amount: 50000, // ví dụ số tiền cần thanh toán
      })
      .then((response) => {
        if (response.data.paymentUrl) {
          setPaymentUrl(response.data.paymentUrl); // Lưu URL thanh toán
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  if (!paymentUrl) {
    return <div>Loading...</div>; // Hiển thị khi chưa nhận được paymentUrl
  }

  return (
    <div>
      <h1>Thanh toán qua MoMo</h1>
      <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
        Click để thanh toán qua MoMo
      </a>
    </div>
  );
}

export default PaymentPage;
