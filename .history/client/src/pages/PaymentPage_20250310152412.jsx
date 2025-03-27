// import { Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';

// const PaymentPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { bookingId } = location.state ?? {};
//   const user = useSelector((state) => state.user);
//   const customerId = user?._id;

//   const [bookingData, setBookingData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
//   const [message, setMessage] = useState('');

//   // Lấy dữ liệu booking từ API để đồng bộ
//   useEffect(() => {
//     const fetchBookingData = async () => {
//       try {
//         if (!bookingId) {
//           throw new Error('Thiếu bookingId');
//         }

//         if (!user || !user.token) {
//           throw new Error('Vui lòng đăng nhập để tiếp tục');
//         }

//         const response = await fetch(`http://localhost:3002/bookings/${bookingId}`, {
//           headers: {
//             Authorization: `Bearer ${user.token}`, // Thêm token xác thực
//           },
//         });
//         const data = await response.json();

//         if (response.ok) {
//           setBookingData(data);
//         } else {
//           throw new Error(data.message || 'Không thể lấy thông tin đặt chỗ.');
//         }
//       } catch (err) {
//         console.error('🔥 Lỗi khi lấy thông tin đặt chỗ:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (bookingId && user?.token) {
//       fetchBookingData();
//     } else {
//       setError('Vui lòng đăng nhập hoặc cung cấp dữ liệu hợp lệ.');
//       setLoading(false);
//     }
//   }, [bookingId, user]);

//   // Hàm thanh toán
//   const handlePayment = async () => {
//     if (!bookingData || !customerId) {
//       alert("Dữ liệu không hợp lệ!");
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:3002/payment/create_payment_url', {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`, // Thêm token xác thực
//         },
//         body: JSON.stringify({
//           bookingId: bookingData._id,
//           totalPrice: bookingData.totalPrice, // Sử dụng dữ liệu từ backend
//           customerId,
//           hostId: bookingData.hostId,
//           bankCode: paymentMethod === "bank_transfer" ? "VNPAY" : "",
//         }),
//       });

//       const data = await response.json();
//       if (response.ok && data.paymentUrl) {
//         window.location.href = data.paymentUrl;
//       } else {
//         alert(data.message || "Không thể tạo URL thanh toán. Vui lòng thử lại.");
//       }
//     } catch (err) {
//       console.error("🔥 Lỗi khi tạo URL thanh toán:", err);
//       alert("Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
//     }
//   };

//   // Hàm gửi tin nhắn
//   const handleSendMessage = async () => {
//     if (!customerId || !bookingData?.hostId || !message) {
//       alert("Vui lòng nhập đầy đủ thông tin trước khi gửi tin nhắn!");
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:3002/chat/send_message', {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           senderId: customerId,
//           receiverId: bookingData.hostId, 
//           message,
//         }),
//       });

//       if (response.ok) {
//         alert("Tin nhắn đã được gửi!");
//         setMessage('');
//       } else {
//         alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
//       }
//     } catch (err) {
//       console.error("🔥 Lỗi khi gửi tin nhắn:", err);
//       alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
//     }
//   };

//   if (loading) {
//     return <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>Đang tải dữ liệu...</Typography>;
//   }

//   if (error || !customerId || !bookingData) {
//     return (
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         <Typography variant="h6" color="error">
//           {error || 'Dữ liệu thanh toán không hợp lệ. Vui lòng quay lại trang trước.'}
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate(-1)}
//           sx={{ mt: 2 }}
//         >
//           Quay lại
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <Card sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 3 }}>
//       <CardContent>
//         <Typography variant="h5" gutterBottom>Chọn phương thức thanh toán</Typography>
//         <Typography variant="h6" color="primary" gutterBottom>
//           Tổng tiền: {bookingData.totalPrice} VND
//         </Typography>
//         <Typography variant="body2" gutterBottom>
//           Chỗ ở: {bookingData.listingId?.title || 'Không xác định'}
//         </Typography>
//         <Typography variant="body2" gutterBottom>
//           Từ: {new Date(bookingData.startDate).toLocaleDateString()} - Đến: {new Date(bookingData.endDate).toLocaleDateString()}
//         </Typography>
//         <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//           <FormControlLabel value="bank_transfer" control={<Radio />} label="Chuyển khoản ngân hàng" />
//           <FormControlLabel value="system_balance" control={<Radio />} label="Nạp vào hệ thống" />
//         </RadioGroup>
//         <Button variant="contained" color="primary" fullWidth onClick={handlePayment} sx={{ mt: 2 }}>
//           Thanh toán
//         </Button>
//         <Typography variant="h6" sx={{ mt: 4 }}>Nhắn tin với người đăng bài</Typography>
//         <TextField
//           fullWidth
//           label="Tin nhắn"
//           multiline
//           rows={3}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           sx={{ mt: 2 }}
//         />
//         <Button variant="contained" color="secondary" fullWidth onClick={handleSendMessage} sx={{ mt: 2 }}>
//           Gửi tin nhắn
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default PaymentPage;