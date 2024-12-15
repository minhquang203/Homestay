import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const { listingId, totalPrice, startDate, endDate } = location.state || {};

  if (!listingId || !totalPrice) {
    return <div>No payment information found.</div>;
  }

  // Logic xử lý thanh toán ở đây (gọi API MoMo, xử lý thanh toán, v.v.)

  return (
    <div>
      <h2>Thanh toán cho chuyến đi</h2>
      <p>Listing ID: {listingId}</p>
      <p>Tổng số tiền: {totalPrice} VND</p>
      <p>Thời gian: {startDate} - {endDate}</p>
      
      {/* Các nút thanh toán, thông tin MoMo, v.v. */}
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
};

export default PaymentPage;
