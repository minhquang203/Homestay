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
          method: "DELETE", // Đảm bảo phương thức là DELETE
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to cancel trip: ${response.statusText}`);
      }

      // Nếu hủy chuyến đi thành công, cập nhật lại danh sách chuyến đi trong Redux
      dispatch(
        setTripList(
          (prevTrips) =>
            prevTrips.filter((trip) => trip.listingId._id !== listingId) // Xóa chuyến đi khỏi danh sách
        )
      );

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
            // Kiểm tra dữ liệu trước khi render
            if (!trip || !trip.listingId || !trip.hostId) {
              console.warn(`Invalid trip data at index ${index}:`, trip);
              return null;
            }

            const { listingId, hostId, startDate, endDate, totalPrice } = trip;

            return (
              <div key={listingId._id || index}>
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
                <button onClick={() => cancelTrip(listingId._id)}>
                  Cancel Trip
                </button>{" "}
                {/* Nút hủy chuyến đi */}
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
