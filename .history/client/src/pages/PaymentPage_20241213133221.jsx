// src/pages/PaymentPage.jsx
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const location = useLocation();
    const { listingId, totalPrice, startDate, endDate } = location.state || {};

    if (!listingId || !totalPrice) {
        return <div>No payment information found.</div>;
    }

    const handlePayment = async () => {
      const requestBody = {
        partnerCode: "MOMO",
        partnerName: "HomeStay",
        storeId: "MomoTestStore",
        requestId: `order-${listingId}`,  // ID đơn hàng duy nhất
        amount: totalPrice,
        orderId: `order-${listingId}`,
        orderInfo: "Thanh toán cho chuyến đi",
        redirectUrl: "http://localhost:3000/payment/success", // URL trả về sau khi thanh toán thành công
        ipnUrl: "http://localhost:3000/payment/ipn", // URL nhận thông báo thanh toán
        // signature: generateSignature(),
      };
    
      try {
        const response = await fetch("http://localhost:3002/payment/momo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
    
        const data = await response.json();
    
        if (data.paymentUrl) {
          // Chuyển hướng người dùng đến MoMo để thanh toán
          window.location.href = data.paymentUrl;
        } else {
          alert("Thanh toán thất bại: " + data.error);
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        alert("Đã xảy ra lỗi khi xử lý thanh toán.");
      }
    };
    

    return (
        <div>
            <h2>Thanh toán cho chuyến đi</h2>
            <p>Listing ID: {listingId}</p>
            <p>Tổng số tiền: {totalPrice} VND</p>
            <p>Thời gian: {startDate} - {endDate}</p>
            
            <button onClick={handlePayment}>Thanh toán</button>
        </div>
    );
};

export default PaymentPage;
