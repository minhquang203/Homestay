import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { facilities } from "../data";
import "../styles/ListingDetails.scss";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const navigate = useNavigate();
  const customerId = useSelector((state) => state.user?._id);

  const getListingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3002/properties/${listingId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Không thể tải thông tin chi tiết.");
      }

      const data = await response.json();
      setListing(data);
    } catch (err) {
      setError(err.message);
      console.log("Fetch Listing Details Failed", err.message);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    getListingDetails();
  }, [getListingDetails]);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  /* Booking */
  const handleSubmit = async () => {
    if (!listing) {
      console.log("Listing data chưa sẵn sàng.");
      return;
    }

    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing?.creator?._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing?.price * dayCount,
      };

      const response = await fetch("http://localhost:3002/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        navigate(`/${customerId}/trips`);
      } else {
        console.log("Submit Booking Failed.");
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">Lỗi: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing?.title}</h1>
        </div>

        <div className="photos">
          {listing?.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={`http://localhost:3002/${item.replace("public", "")}`}
              alt="listing photos"
            />
          ))}
        </div>

        <h2>
          {listing?.type} in {listing?.city}, {listing?.province}, {listing?.country}
        </h2>
        <p>
          {listing?.guestCount} guest - {listing?.bedroomCount} bedroom(s) -{" "}
          {listing?.bedCount} bed(s) - {listing?.bathroomCount} bathroom(s)
        </p>
        <hr />
        <div className="profile">
          <h3>
            Hosted by {listing?.creator?.firstName} {listing?.creator?.lastName}
          </h3>
        </div>
        <hr />
        <h3>Description</h3>
        <p>{listing?.description}</p>
        <h3>{listing?.highlight}</h3>
        <p>{listing?.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing?.amenities[0]
                ?.split(",")
                .map((item, index) => (
                  <div className="facility" key={index}>
                    <div className="facility_icon">
                      {facilities.find((facility) => facility.name === item)?.icon}
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
            </div>
          </div>

          <h2>How long do you want to stay?</h2>
          <div className="date-range-calendar">
            <DateRange ranges={dateRange} onChange={handleSelect} />
            <h2>
              ${listing?.price} x {dayCount} night(s)
            </h2>
            <h2>Total Price: ${listing?.price * dayCount}</h2>
            <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
            <p>End Date: {dateRange[0].endDate.toDateString()}</p>

            <button className="button" type="submit" onClick={handleSubmit}>
              BOOKING
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetails;
