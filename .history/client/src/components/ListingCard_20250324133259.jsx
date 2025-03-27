import React from "react";
import { Link } from "react-router-dom";
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
  status,
  paymentStatus,
}) => {
  return (
    <Link to={`/properties/${listingId}`}>
      <div className="listing-card">
        <img
          src={listingPhotoPaths?.[0] || "default-image.jpg"}
          alt={category}
          className="listing-image"
        />
        <div className="listing-info">
          <h3>{`${city}, ${province}, ${country}`}</h3>
          <p>{category}</p>
          {booking && (
            <>
              <p>Ngày bắt đầu: {new Date(startDate).toLocaleDateString()}</p>
              <p>Ngày kết thúc: {new Date(endDate).toLocaleDateString()}</p>
              <p>Tổng giá: {totalPrice.toLocaleString()} VND</p>
              <p>Trạng thái: {status}</p>
              <p>Thanh toán: {paymentStatus}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;