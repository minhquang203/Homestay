// src/pages/PaymentPage.jsx
import axios from 'axios';
import React, { useState } from 'react';

const PaymentPage = () => {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async () => {
    try {
      // Gửi yêu cầu thanh toán đến API backend
      const response = await axios.post('http://localhost:3002/payment/momo', {
        amount: 50000,  // Thay đổi giá trị theo yêu cầu của bạn
        orderId: 'ORDER123',  // Tạo ID đơn hàng duy nhất
        requestId: 'REQUEST123'  // Tạo ID yêu cầu duy nhất
      });

      // Kiểm tra kết quả trả về
      if (response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);  // Lấy paymentUrl từ phản hồi
      } else {
        setErrorMessage('Payment creation failed.');
      }
    } catch (error) {
      setErrorMessage('Error during payment process');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <button onClick={handlePayment}>Pay with MoMo</button>

      {paymentUrl && (
        <div>
          <h3>Payment URL:</h3>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer">Click to pay</a>
        </div>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PaymentPage;
