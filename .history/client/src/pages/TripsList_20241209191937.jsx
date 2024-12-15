import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển trang
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { setTripList } from "../Redux/state";
import "../styles/List.scss";

const TripsList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Hook để điều hướng sang trang thanh toán

  const getTripList = async () => {
    try {
      if (!userId) {
        console.error("User ID is not available");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3002/users/${userId}/trips`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch trips: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        dispatch(setTripList(data));
      } else {
        console.warn("Invalid data format from API:", data);
      }

      setLoading(false);
    } catch (err) {
      console.error("Fetch trip list failed:", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]);

  const handleBooking = async (trip) => {
    // Tạo đơn thanh toán thông qua API của Momo
    try {
      const paymentData = {
        amount: trip.totalPrice, // Số tiền thanh toán
        orderId: `order-${trip.listingId._id}`, // Mã đơn hàng duy nhất
        returnUrl: "http://localhost:3000/payment-success", // URL quay lại sau khi thanh toán thành công
        cancelUrl: "http://localhost:3000/payment-cancel", // URL quay lại nếu thanh toán bị hủy
        // Các tham số khác của Momo (tùy thuộc vào tài liệu API của Momo)
      };

      const response = await fetch("http://localhost:3002/payment/momo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result && result.paymentUrl) {
        // Điều hướng đến trang thanh toán Momo
        window.location.href = result.paymentUrl; // Momo trả về URL thanh toán
      } else {
        console.error("Thanh toán thất bại. Không thể lấy URL thanh toán.");
      }
    } catch (err) {
      console.error("Lỗi khi tạo đơn thanh toán Momo:", err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Danh sách chuyến đi của bạn</h1>
      <div className="list">
        {tripList?.length > 0 ? (
          tripList.map((trip, index) => {
            if (!trip || !trip.listingId || !trip.hostId) {
              console.warn(`Invalid trip data at index ${index}:`, trip);
              return null;
            }

            const { listingId, hostId, startDate, endDate, totalPrice } = trip;

            return (
              <ListingCard
                key={listingId._id || index}
                listingId={listingId._id}
                creator={hostId._id}
                listingPhotoPaths={listingId.listingPhotoPaths}
                city={listingId.city}
                province={listingId.province}
                country={listingId.country}
                category={listingId.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={true}
                onBook={() => handleBooking(trip)}  // Gọi handleBooking khi bấm Đặt phòng
              />
            );
          })
        ) : (
          <p>Không tìm thấy chuyến đi nào.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripsList;
