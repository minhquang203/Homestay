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

  useEffect(() => {
    getTripList();
  }, [userId]);

  console.log("tripList:", tripList, typeof tripList);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Danh sách chuyến đi của bạn</h1>
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
            } = trip;

            return (
              <ListingCard
                key={listingId._id || index} // Sử dụng index nếu không có _id
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
            );
          })
        ) : (
          <p>Không tìm thấy chuyến đi nào.</p>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default TripsList;
