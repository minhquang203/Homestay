// src/pages/PaymentPage.jsx
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const location = useLocation();
    const { listingId, totalPrice, startDate, endDate } = location.state || {};

    if (!listingId || !totalPrice) {
        return <div>No payment information found.</div>;
    }

    const handlePayment = async () => {
        const response = await fetch("http://localhost:3002/payment/momo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                listingId,
                totalPrice,
                startDate,
                endDate,
            }),
        });

        const data = await response.json();
        if (data.paymentUrl) {
            window.location.href = data.paymentUrl; // Redirect to MoMo payment page
        } else {
            alert("Payment failed: " + data.error);
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
