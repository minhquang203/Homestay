import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { setTripList } from "../Redux/state";
import "../styles/List.scss";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id); // Optional chaining
  const tripList = useSelector((state) => state.user?.tripList); // Optional chaining
  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      if (!userId) {
        console.log("User ID is not available");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/users/${userId}/trips`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, [userId]); // Thêm userId làm dependency để đảm bảo userId được load

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList && tripList.length > 0 ? ( // Kiểm tra tripList
          tripList.map(
            ({
              listingId,
              hostId,
              startDate,
              endDate,
              totalPrice,
              booking = true,
            }) => (
              <ListingCard
                key={listingId?._id || Math.random()} // Dùng fallback key
                listingId={listingId?._id} // Optional chaining
                creator={hostId?._id} // Optional chaining
                listingPhotoPaths={listingId?.listingPhotoPaths}
                city={listingId?.city}
                province={listingId?.province}
                country={listingId?.country}
                category={listingId?.category}
                startDate={startDate}
                endDate={endDate}
                totalPrice={totalPrice}
                booking={booking}
              />
            )
          )
        ) : (
          <p>No trips available</p> // Hiển thị nếu danh sách rỗng
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default TripList;
