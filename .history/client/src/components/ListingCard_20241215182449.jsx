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

  // Hàm xử lý thanh toán
  const handleBooking = async () => {
    if (!user) {
      setError("Bạn cần đăng nhập để thực hiện thanh toán.");
      return;
    }

    const bookingData = {
      amount: totalPrice,  // Số tiền thanh toán
      orderInfo: `Chuyến đi từ ${startDate} đến ${endDate}`,  // Thông tin đơn hàng
      userId: user._id,  // ID người dùng
      startDate: startDate,  // Ngày đi
      endDate: endDate,  // Ngày về
      bookingId: listingId,  // Mã booking (hoặc có thể là bookingId từ props)
    };

    try {
      const response = await fetch('http://localhost:3002/api/create_payment_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;  // Chuyển hướng người dùng tới trang thanh toán
      } else {
        console.log('Có lỗi khi tạo URL thanh toán');
        setError('Không thể tạo URL thanh toán. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Lỗi khi gọi API tạo URL thanh toán:', err);
      setError('Có lỗi khi kết nối đến hệ thống thanh toán.');
    }
  };

  return (
    <div className="listing-card">
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
            <span>{price} VND</span> mỗi đêm
          </p>
        </>
      ) : (
        <>
          <p>
            {startDate} - {endDate}
          </p>
          <p>
            <span>{totalPrice} VND</span> tổng cộng
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

      {!booking && (
        <button
          className="book-now"
          onClick={handleBooking}
          disabled={!user}
        >
          Đặt ngay
        </button>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ListingCard;
