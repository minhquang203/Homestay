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
  const [error, setError] = useState(null); // Để quản lý thông báo lỗi
  const userId = useSelector((state) => state.user._id); // Lấy userId từ Redux store
  const tripList = useSelector((state) => state.user.tripList); // Lấy tripList từ Redux store
  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      if (!userId) {
        console.error("User ID is not available");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:3002/users/${userId}/trips`,
        {
          method: "GET",
        }
      );

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
      setError("Failed to load trips. Please try again later.");
      setLoading(false);
    }
  };

  const cancelTrip = async (listingId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/users/${userId}/trips/${listingId}/cancel`,
        {
          method: "DELETE", // Sử dụng DELETE để xóa chuyến đi
        }
      );
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to cancel trip: ${response.statusText}`);
      }
  
      // Nếu hủy chuyến đi thành công, cập nhật lại danh sách chuyến đi trong Redux
      dispatch(
        setTripList((data) => data.filter((trip) => trip.listingId._id !== listingId))
      );
  
      // Cập nhật giao diện sau khi xóa
      setLoading(false);
      console.log("Trip canceled and deleted:", data.message);
    } catch (err) {
      console.error("Cancel trip failed:", err.message);
      setError("Failed to cancel trip. Please try again later.");
    }
  };
  

  useEffect(() => {
    getTripList();
  }, [userId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.length > 0 ? (
          tripList.map((trip, index) => {
            if (!trip || !trip.listingId || !trip.hostId) {
              console.warn(`Invalid trip data at index ${index}:`, trip);
              return null; // Bỏ qua mục không hợp lệ
            }

            const {
              listingId,
              hostId,
              startDate,
              endDate,
              totalPrice,
              status,
            } = trip;

            return (
              <div key={listingId._id || index} className="listing-card-container">
                <ListingCard
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
                />
                {status !== "canceled" && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelTrip(listingId._id)}
                  >
                    Cancel Trip
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>No trips found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripsList;
