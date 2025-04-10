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
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);
  const dispatch = useDispatch();

  // Hàm lấy danh sách đặt phòng
  const getReservationList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/users/${userId}/reservations`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      dispatch(setReservationList(data));
    } catch (err) {
      console.log("❌ Fetch Reservation List failed!", err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect gọi API khi có userId
  useEffect(() => {
    if (userId) {
      getReservationList();
    }
  }, [userId]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <h1 className="title-list">Danh sách đặt chỗ của bạn</h1>
      <div className="list">
        {reservationList?.map((reservation, index) => {
          const {
            listingId,
            hostId,
            startDate,
            endDate,
            totalPrice,
            booking = true,
          } = reservation;

          // Nếu thiếu dữ liệu thì bỏ qua không render
          if (!listingId || !hostId) {
            console.warn("⚠️ Dữ liệu thiếu:", reservation);
            return null;
          }

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
              booking={booking}
            />
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default ReservationList;
