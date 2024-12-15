// PaymentPage.js
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy thông tin từ URL (truyền từ listing card hoặc các bước trước đó)
    const state = location.state;
    if (state && state.paymentUrl) {
      setPaymentUrl(state.paymentUrl);
    } else {
      setError("Không có URL thanh toán.");
    }

    // Tự động chuyển hướng sau 5 giây (hoặc thời gian khác nếu muốn)
    if (paymentUrl) {
      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 3000); // 3 giây trước khi chuyển hướng đến VNPay
    }
  }, [location.state, paymentUrl]);

  return (
    <div className="payment-page">
      <h2>Chờ một chút...</h2>
      {paymentUrl ? (
        <>
          <p>Đang chuyển hướng bạn tới cổng thanh toán VNPay...</p>
          <p>Chúng tôi sẽ tự động chuyển hướng sau vài giây.</p>
        </>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default PaymentPage;
