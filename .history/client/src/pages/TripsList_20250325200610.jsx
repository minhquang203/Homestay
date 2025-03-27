import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { setTripList } from "../redux/state";
import "../styles/List.scss";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user?._id);
  const tripList = useSelector((state) => state.user?.tripList || []);
  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      if (!userId) {
        throw new Error("Vui lòng đăng nhập để xem danh sách chuyến đi.");
      }

      const response = await fetch(`http://localhost:3001/users/${userId}/trips`, {
        method: "GET",
        credentials: "include", // Thêm nếu cần authentication
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi tải dữ liệu: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu từ API không hợp lệ.");
      }

      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chuyến đi:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getTripList();
    } else {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem danh sách chuyến đi.");
    }
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Danh sách chuyến đi của bạn</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="list">
        {tripList.length > 0 ? (
          tripList.map((trip, index) => {
            if (!trip?.listingId || !trip?.hostId) {
              console.warn(`Dữ liệu chuyến đi không hợp lệ tại index ${index}`);
              return null;
            }

            const { listingId, hostId, startDate, endDate, totalPrice, booking } = trip;

            return (
              <ListingCard
                key={trip._id || index}
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
                booking={booking} // Giá trị từ API
              />
            );
          }).filter(Boolean) // Lọc bỏ các phần tử null
        ) : (
          <p>Không tìm thấy chuyến đi nào.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;