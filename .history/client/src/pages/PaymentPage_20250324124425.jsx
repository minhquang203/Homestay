import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearPayment } from '../Redux/state';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.payment);

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  useEffect(() => {
    if (!payment || !payment.bookingId || !payment.totalPrice || !payment.customerId) {
      alert("Dữ liệu thanh toán không hợp lệ!");
      // navigate('/');
    }
  }, [payment, navigate]);

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3002/payment/create_payment_url', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: payment.bookingId,
          totalPrice: payment.totalPrice,
          customerId: payment.customerId,
          paymentMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert("Không thể tạo URL thanh toán. Vui lòng thử lại.");
        }
      } else {
        const errorData = await response.json();
        alert(`Lỗi từ server: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Lỗi khi tạo URL thanh toán:", err);
      alert("Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    dispatch(clearPayment());
    navigate('/');
  };

  return (
    <div>
      <h1>Chọn phương thức thanh toán</h1>
      <div>
        <label>
          <input
            type="radio"
            value="bank_transfer"
            checked={paymentMethod === 'bank_transfer'}
            onChange={() => setPaymentMethod('bank_transfer')}
          />
          Chuyển khoản ngân hàng
        </label>
        <label>
          <input
            type="radio"
            value="system_balance"
            checked={paymentMethod === 'system_balance'}
            onChange={() => setPaymentMethod('system_balance')}
          />
          Nạp vào hệ thống
        </label>
      </div>
      <button onClick={handlePayment}>Thanh toán</button>
      <button onClick={handleCancel}>Hủy</button>
    </div>
  );
};

export default PaymentPage;