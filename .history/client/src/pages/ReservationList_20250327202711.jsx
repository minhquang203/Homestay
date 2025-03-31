import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../Redux/state";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import "../styles/List.scss";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);
  const dispatch = useDispatch();

  const getReservationList = async () => {
    try {
      if (!userId) {
        throw new Error("User ID is not available");
      }

      const response = await fetch(
        `http://localhost:3002/users/${userId}/reservations`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      dispatch(setReservationList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Reservation List failed!", err.message);
      setError("Không thể tải danh sách đặt chỗ. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getReservationList();
    }
  }, [userId]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Danh sách đặt chỗ của bạn</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="list">
        {reservationList?.length > 0 ? (
          reservationList.map(
            ({
              listingId,
              hostId,
              startDate,
              endDate,
              totalPrice,
              booking = true,
            }) => (
              <ListingCard
                key={listingId._id}
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
                booking={booking}
              />
            )
          )
        ) : (
          <p>Không tìm thấy đặt chỗ nào.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;