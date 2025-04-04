import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { setTripList } from "../Redux/state";
import "../styles/List.scss";

const TripsList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user?._id);
  const tripList = useSelector((state) => state.user?.tripList || []);
  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      if (!userId) {
        throw new Error("User ID is not available. Please log in.");
      }

      const response = await fetch(`http://localhost:3002/users/${userId}/trips`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch trips: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format from API");
      }

      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.error("Fetch trip list failed:", err.message);
      setError(err.message || "Không thể tải danh sách chuyến đi. Vui lòng thử lại.");
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
            if (!trip || !trip.listingId || !trip.hostId) {
              console.warn(`Invalid trip data at index ${index}:`, trip);
              return null;
            }

            const { listingId, hostId, startDate, endDate, totalPrice, status, paymentStatus } = trip;

            return (
              <ListingCard
                key={trip._id || index} // Sử dụng trip._id làm key
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
                booking={trip} // Truyền toàn bộ đối tượng trip làm booking
                status={status}
                paymentStatus={paymentStatus}
              />
            );
          }).filter(Boolean)
        ) : (
          <p>Không tìm thấy chuyến đi nào.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripsList;