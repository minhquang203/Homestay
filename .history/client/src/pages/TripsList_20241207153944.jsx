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
  const [cancelling, setCancelling] = useState(false); // State để kiểm soát trạng thái hủy
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
      setLoading(false);
    }
  };

  const cancelTrip = async (userId, listingId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/users/${userId}/trips/${listingId}/cancel`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel trip: ${response.statusText}`);
      }

      return response.json();
    } catch (err) {
      console.error("Error canceling trip:", err.message);
      throw err;
    }
  };

  const handleCancelTrip = async (listingId) => {
    setCancelling(true);
    try {
      await cancelTrip(userId, listingId);
      // Cập nhật lại danh sách chuyến đi sau khi hủy
      const updatedTrips = tripList.filter((trip) => trip.listingId._id !== listingId);
      dispatch(setTripList(updatedTrips));
    } catch (err) {
      console.error("Error canceling trip:", err.message);
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]);

  console.log("tripList:", tripList, typeof tripList);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.length > 0 ? (
          tripList.map((trip, index) => {
            // Kiểm tra dữ liệu trước khi render
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
              <div key={listingId._id || index} className="trip-item">
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
                {status !== 'canceled' && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelTrip(listingId._id)}
                    disabled={cancelling}
                  >
                    {cancelling ? 'Canceling...' : 'Cancel Trip'}
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