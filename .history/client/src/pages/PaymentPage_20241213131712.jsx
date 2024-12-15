import { useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const { listingId, totalPrice, startDate, endDate } = location.state || {};
  
  if (!listingId || !totalPrice) {
    return <div>No payment information found.</div>;
  }

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Gọi API MoMo để tạo đơn thanh toán
  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    const paymentData = {
      listingId,
      totalPrice,
      startDate,
      endDate,
    };

    try {
      // Gọi API backend để tạo đơn thanh toán
      const response = await fetch("http://localhost:3002/payment/momo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok && result.paymentUrl) {
        // Nếu API trả về URL thanh toán, chuyển hướng đến MoMo
        window.location.href = result.paymentUrl; // Điều hướng đến MoMo
      } else {
        setError("Failed to initiate payment.");
      }
    } catch (error) {
      setError("An error occurred while processing the payment.");
    } finally {
      setIsProcessing(false);
    }
  };
  console.log({
    listingId,
    totalPrice,
    startDate,
    endDate,
});


  return (
    <div>
      <h2>Thanh toán cho chuyến đi</h2>
      <p>Listing ID: {listingId}</p>
      <p>Tổng số tiền: {totalPrice} VND</p>
      <p>Thời gian: {startDate} - {endDate}</p>

      {isProcessing ? (
        <p>Đang xử lý thanh toán...</p>
      ) : (
        <div>
          <button onClick={handlePayment}>Thanh toán</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PaymentPage;
