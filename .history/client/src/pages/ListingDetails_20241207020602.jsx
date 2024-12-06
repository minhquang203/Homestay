import { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { facilities } from "../data";
import "../styles/ListingDetails.scss";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi
  const { listingId } = useParams(); // Lấy ID danh sách từ URL
  const [listing, setListing] = useState(null); // Chi tiết của bất động sản

  const navigate = useNavigate(); // Điều hướng giữa các trang
  const customerId = useSelector((state) => state.user?._id); // Lấy ID khách hàng từ Redux

  // Hàm lấy chi tiết bất động sản
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
      console.error("Lỗi khi tải chi tiết bất động sản:", err.message);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  // Gọi hàm lấy dữ liệu khi component được render
  useEffect(() => {
    getListingDetails();
  }, [getListingDetails]);

  // Xử lý lịch đặt phòng
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
  const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Tính số ngày lưu trú

  // Xử lý đặt phòng
  const handleSubmit = async () => {
    if (!listing) {
      console.log("Thông tin bất động sản chưa sẵn sàng.");
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
        navigate(`/${customerId}/trips`); // Điều hướng đến trang đặt phòng
      } else {
        console.error("Lỗi khi gửi thông tin đặt phòng.");
      }
    } catch (err) {
      console.error("Lỗi khi gửi thông tin đặt phòng:", err.message);
    }
  };

  // Hiển thị loader nếu đang tải dữ liệu
  if (loading) {
    return <Loader />;
  }

  // Hiển thị lỗi nếu có lỗi
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
              alt="Hình ảnh bất động sản"
            />
          ))}
        </div>

        <h2>
          {listing?.type} tại {listing?.city}, {listing?.province}, {listing?.country}
        </h2>
        <p>
          {listing?.guestCount} khách - {listing?.bedroomCount} phòng ngủ -{" "}
          {listing?.bedCount} giường - {listing?.bathroomCount} phòng tắm
        </p>
        <hr />
        <div className="profile">
          <h3>
            Được quản lý bởi {listing?.creator?.firstName} {listing?.creator?.lastName}
          </h3>
        </div>
        <hr />
        <h3>Mô tả</h3>
        <p>{listing?.description}</p>
        <h3>{listing?.highlight}</h3>
        <p>{listing?.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>Những gì nơi này cung cấp?</h2>
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

          <h2>Bạn muốn lưu trú bao lâu?</h2>
          <div className="date-range-calendar">
            <DateRange ranges={dateRange} onChange={handleSelect} />
            <h2>
              ${listing?.price} x {dayCount} đêm
            </h2>
            <h2>Tổng cộng: ${listing?.price * dayCount}</h2>
            <p>Ngày bắt đầu: {dateRange[0].startDate.toDateString()}</p>
            <p>Ngày kết thúc: {dateRange[0].endDate.toDateString()}</p>

            <button className="button" type="submit" onClick={handleSubmit}>
              ĐẶT PHÒNG
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default ListingDetails;
