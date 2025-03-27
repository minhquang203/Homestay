import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Favorite,
} from "@mui/icons-material";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setWishList } from "../Redux/state";
import "../styles/ListingCard.scss";

const ListingCard = ({
  listingId,
  creator,
  listingPhotoPaths = [],
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = useMemo(
    () => wishList.some((item) => item?._id === listingId),
    [wishList, listingId]
  );

  const goToPrevSlide = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
      );
    },
    [listingPhotoPaths.length]
  );

  const goToNextSlide = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % listingPhotoPaths.length
      );
    },
    [listingPhotoPaths.length]
  );

  const patchWishList = async (e) => {
    e.stopPropagation();
    if (!user || user._id === creator._id) return;

    try {
      const response = await fetch(
        `http://localhost:3002/users/${user?._id}/${listingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok)
        throw new Error("Không thể cập nhật danh sách yêu thích");
      const data = await response.json();
      dispatch(setWishList(data.wishList));
    } catch (err) {
      console.error("🔥 Lỗi khi thêm vào danh sách yêu thích:", err);
    }
  };

  const handleCardClick = () => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!user || !user._id) {
      alert("Vui lòng đăng nhậpเพื่อ tiếp tục!");
      navigate("/login");
      return;
    }
  
    if (booking) {
      // Kiểm tra dữ liệu booking
      if (!booking._id || !totalPrice || !creator?._id) {
        alert("Dữ liệu đặt chỗ không hợp lệ!");
        return;
      }
  
      // Chuyển hướng đến PaymentPage với đầy đủ dữ liệu
      navigate("/payment", {
        state: {
          bookingId: booking._id,
          totalPrice: totalPrice, // Lưu ý: totalPrice sẽ được đồng bộ lại trong PaymentPage bằng API
          customerId: user._id,
          hostId: creator._id, // Truyền hostId để PaymentPage sử dụng
        },
      });
    } else {
      // Nếu không có booking, chuyển hướng đến trang chi tiết listing
      if (!listingId) {
        alert("Dữ liệu listing không hợp lệ!");
        return;
      }
      navigate(`/properties/${listingId}`);
    }
  };
  return (
    <div className="listing-card" onClick={handleCardClick}>
      <div className="slider-container">
        {listingPhotoPaths.length > 0 ? (
          <div
            className="slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {listingPhotoPaths.map((photo, index) => (
              <div key={index} className="slide">
                <img
                  src={`http://localhost:3002/${photo.replace("public", "")}`}
                  alt={`photo ${index + 1}`}
                />
                <div className="prev-button" onClick={goToPrevSlide}>
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div className="next-button" onClick={goToNextSlide}>
                  <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-photo">Không có ảnh</p>
        )}
      </div>

      <h3>{`${city}, ${province}, ${country}`}</h3>
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

      <button className="favorite" onClick={patchWishList} disabled={!user}>
        <Favorite sx={{ color: isLiked ? "red" : "white" }} />
      </button>
    </div>
  );
};

export default ListingCard;
