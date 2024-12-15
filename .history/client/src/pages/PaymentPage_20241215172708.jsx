import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PaymentPage() {
  const { tripId } = useParams(); // Lấy tripId từ URL
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentUrl = async () => {
      try {
        // Gửi yêu cầu đến backend để tạo URL thanh toán
        const response = await axios.post("http://localhost:3002/payment/create_payment_url", {
          tripId: tripId, // Truyền tripId vào yêu cầu
        });

        const { paymentUrl } = response.data;
        setPaymentUrl(paymentUrl);
        setLoading(false);
      } catch (err) {
        setError("Không thể tạo URL thanh toán. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchPaymentUrl();
  }, [tripId]);

  const handlePayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl; // Chuyển hướng người dùng đến cổng thanh toán
    }
  };

  return (
    <div>
      {loading && <p>Đang tạo URL thanh toán...</p>}
      {error && <p>{error}</p>}
      {paymentUrl && <button onClick={handlePayment}>Thanh toán</button>}
    </div>
  );
}

export default PaymentPage;
