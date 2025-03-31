import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
      setError("Không thể tải danh sách chuyến đi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Define handleBooking function
  const handleBooking = async (trip) => {
    try {
      const response = await fetch("http://localhost:3002/payment/create_payment_url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: trip.totalPrice,
          bankCode: "NCB",
          listingId: trip.listingId._id,
          userId: userId,
          startDate: trip.startDate,
          endDate: trip.endDate,
          hostId: trip.hostId._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Có lỗi xảy ra từ server");
      }

      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl; // Redirect to VNPay payment URL
      } else {
        setError("Không thể tạo URL thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi khi tạo URL thanh toán VNPay:", err);
      setError("Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
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
                onBook={() => handleBooking(trip)} // Now handleBooking is defined
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