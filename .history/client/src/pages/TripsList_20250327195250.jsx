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
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);
  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      if (!userId) {
        console.error("ID người dùng không khả dụng");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3002/users/${userId}/trips`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Không thể lấy danh sách chuyến đi: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        dispatch(setTripList(data));
      } else {
        console.warn("Định dạng dữ liệu từ API không hợp lệ:", data);
      }

      setLoading(false);
    } catch (err) {
      console.error("Lấy danh sách chuyến đi thất bại:", err.message);
      setError("Không thể tải danh sách chuyến đi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      setError(error);
      // Làm mới danh sách chuyến đi để đảm bảo dữ liệu được cập nhật
      getTripList();
    }
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Danh sách chuyến đi của bạn</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="list">
        {tripList?.length > 0 ? (
          tripList.map((trip, index) => {
            if (!trip || !trip.listingId || !trip.hostId) {
              console.warn(`Dữ liệu chuyến đi không hợp lệ tại chỉ số ${index}:`, trip);
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