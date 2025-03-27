import { ArrowBackIosNew, ArrowForwardIos, Favorite } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setWishList } from "../Redux/state";
import "../styles/ListingCard.scss";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const goToPrevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const patchWishList = async (e) => {
    e.stopPropagation();
    if (!user) return;
    
    if (user._id !== creator._id) {
      try {
        const response = await fetch(
          `http://localhost:3002/users/${user?._id}/${listingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        dispatch(setWishList(data.wishList));
      } catch (err) {
        console.error("Lỗi khi thêm vào danh sách yêu thích:", err);
      }
    }
  };

  const handleCardClick = async () => {
    if (booking) {
      try {
        const response = await fetch('http://localhost:3002/payment/create_payment_url', {
          method: 'POST',
          body: JSON.stringify({
            amount: 10000,
            bankCode: 'NCB',
          }),
        });
        // Kiểm tra nếu server trả về URL để redirect
        if (response.redirected) {
          window.location.href = response.url; // Chuyển hướng trình duyệt tới URL thanh toán
        } else {
          const data = await response.json();
          console.error('Error from server:', data);
          alert("Có lỗi xảy ra từ server");
        }
      } catch (err) {
        console.error("Lỗi khi tạo URL thanh toán:", err);
        setError("Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
      }
    } else {
      navigate(`/properties/${listingId}`);
    }

  };
  
  

  return (
    <div className="listing-card" onClick={handleCardClick}>
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`http://localhost:3002/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
              />
              <div
                className="prev-button"
                onClick={goToPrevSlide}
              >
                <ArrowBackIosNew sx={{ fontSize: "15px" }} />
              </div>
              <div
                className="next-button"
                onClick={goToNextSlide}
              >
                <ArrowForwardIos sx={{ fontSize: "15px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>

      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            <span>{price}VND</span> mỗi đêm
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <p>
            <span>VND{totalPrice}</span> tổng cộng
          </p>
        </>
      )}

      <button
        className="favorite"
        onClick={patchWishList}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ListingCard;

 
