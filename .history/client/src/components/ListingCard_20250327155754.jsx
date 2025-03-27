import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/ListingCard.scss";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  startDate,
  endDate,
  totalPrice,
  booking,
  onBook, // Add onBook prop
}) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user._id);

  const handleCardClick = async () => {
    if (booking) {
      if (onBook) {
        // If onBook is provided, call it
        onBook();
      } else {
        // Otherwise, use the default payment logic
        try {
          const amount = totalPrice;
          const selectedBankCode = "NCB";

          if (!amount || isNaN(amount) || amount <= 0) {
            setError("Số tiền không hợp lệ. Vui lòng kiểm tra lại.");
            return;
          }

          const response = await fetch('http://localhost:3002/payment/create_payment_url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: amount,
              bankCode: selectedBankCode,
              listingId: listingId,
              userId: userId,
              startDate: startDate,
              endDate: endDate,
              hostId: creator,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Có lỗi xảy ra từ server');
          }

          const data = await response.json();
          if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
          } else {
            throw new Error('Không nhận được URL thanh toán từ server');
          }
        } catch (err) {
          console.error("Lỗi khi tạo URL thanh toán:", err);
          setError(err.message || "Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
        }
      }
    } else {
      navigate(`/properties/${listingId}`);
    }
  };

  return (
    <div className="listing-card" onClick={handleCardClick}>
      {/* Your existing JSX for rendering the card */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ListingCard;