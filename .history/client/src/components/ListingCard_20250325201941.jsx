import { ArrowBackIosNew, ArrowForwardIos, Favorite } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPayment, setWishList } from "../Redux/state";
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
  status, // Trạng thái của Booking
  paymentStatus, // Trạng thái thanh toán của Booking
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const isLiked = wishList?.find((item) => item?._id === listingId);

  const photos = Array.isArray(listingPhotoPaths) && listingPhotoPaths.length > 0
    ? listingPhotoPaths
    : ["default-image.jpg"];

  const goToPrevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const goToNextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const patchWishList = async (e) => {
    e.stopPropagation();
    if (!user) {
      setError("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
      return;
    }
    if (user._id !== creator) {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:3002/users/${user._id}/${listingId}`,
          { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include" }
        );
        if (!response.ok) throw new Error("Không thể cập nhật danh sách yêu thích.");
        const data = await response.json();
        dispatch(setWishList(data.wishList));
      } catch (err) {
        console.error("Lỗi khi thêm vào danh sách yêu thích:", err);
        setError("Không thể cập nhật danh sách yêu thích. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Hàm xử lý thanh toán
  const handlePayment = (e) => {
    e.stopPropagation(); // Ngăn click card kích hoạt handleCardClick
    if (!booking || !booking._id || !totalPrice || !user?._id) {
      setError("Dữ liệu không hợp lệ để thanh toán. Vui lòng thử lại.");
      return;
    }
    if (status !== "approved") {
      setError("Đơn đặt phòng chưa được duyệt. Vui lòng chờ duyệt.");
      return;
    }
    if (paymentStatus !== "pending") {
      setError("Đơn đặt phòng đã được thanh toán hoặc không ở trạng thái chờ.");
      return;
    }
    dispatch(setPayment({ bookingId: booking._id, totalPrice, customerId: user._id }));
    navigate("/payment");
  };

  // Chỉ chuyển hướng đến trang chi tiết khi không có booking
  const handleCardClick = () => {
    if (!booking) {
      navigate(`/properties/${listingId}`);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="listing-card" onClick={handleCardClick}>
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {photos.map((photo, index) => (
            <div key={index} className="slide">
              <img
                src={`http://localhost:3002/${photo?.replace("public", "")}`}
                alt={`photo ${index + 1}`}
                onError={() => setError("Không thể tải ảnh.")}
              />
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <div className="prev-button" onClick={goToPrevSlide}>
              <ArrowBackIosNew sx={{ fontSize: "15px" }} />
            </div>
            <div className="next-button" onClick={goToNextSlide}>
              <ArrowForwardIos sx={{ fontSize: "15px" }} />
            </div>
          </>
        )}
      </div>

      <h3>{city}, {province}, {country}</h3>
      <p>{category}</p>

      {booking ? (
        <>
          <p>{formatDate(startDate)} - {formatDate(endDate)}</p>
          <p><span>{totalPrice?.toLocaleString()} VND</span> tổng cộng</p>
          <p>Trạng thái: {status}</p>
          <p>Thanh toán: {paymentStatus}</p>
          <button
            onClick={handlePayment}
            disabled={status !== "approved" || paymentStatus !== "pending"}
            className="payment-button"
          >
            Thanh toán
          </button>
        </>
      ) : (
        <>
          <p>{type}</p>
          <p><span>{price?.toLocaleString()} VND</span> mỗi đêm</p>
        </>
      )}

      <button
        className="favorite"
        onClick={patchWishList}
        disabled={!user || loading}
        title={isLiked ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
      >
        {loading ? "Đang xử lý..." : isLiked ? <Favorite sx={{ color: "red" }} /> : <Favorite sx={{ color: "white" }} />}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ListingCard;