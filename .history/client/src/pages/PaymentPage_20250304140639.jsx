import { Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Giả sử bạn dùng Redux để quản lý state user
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalPrice, hostId } = location.state ?? {}; 

  const user = useSelector((state) => state.user); // Lấy user từ Redux
  const customerId = user?._id; // Lấy user ID từ state

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [message, setMessage] = useState('');

  // Hàm thanh toán
  const handlePayment = async () => {
    if (!bookingId || !totalPrice || !customerId || !hostId) {
      alert("Dữ liệu không hợp lệ!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/payment/create_payment_url', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, totalPrice, customerId, hostId,paymentMethod }),
      });

      const data = await response.json();
      if (response.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert(data.message || "Không thể tạo URL thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("🔥 Lỗi khi tạo URL thanh toán:", err);
      alert("Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
    }
  };

  // Hàm gửi tin nhắn
  const handleSendMessage = async () => {
    if (!customerId || !hostId || !message) {
      alert("Vui lòng nhập đầy đủ thông tin trước khi gửi tin nhắn!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3002/chat/send_message', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: customerId, receiverId: hostId, message }),
      });

      if (response.ok) {
        alert("Tin nhắn đã được gửi!");
        setMessage('');
      } else {
        alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("🔥 Lỗi khi gửi tin nhắn:", err);
      alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Chọn phương thức thanh toán</Typography>
        
        {!bookingId || !totalPrice || !customerId || !hostId ? (
          <Typography variant="h6" color="error">
            Dữ liệu thanh toán không hợp lệ. Vui lòng quay lại trang trước.
          </Typography>
        ) : (
          <>
            <Typography variant="h6" color="primary" gutterBottom>Tổng tiền: {totalPrice} VND</Typography>

            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel value="bank_transfer" control={<Radio />} label="Chuyển khoản ngân hàng" />
              <FormControlLabel value="system_balance" control={<Radio />} label="Nạp vào hệ thống" />
            </RadioGroup>

            <Button variant="contained" color="primary" fullWidth onClick={handlePayment} sx={{ mt: 2 }}>
              Thanh toán
            </Button>

            <Typography variant="h6" sx={{ mt: 4 }}>Nhắn tin với người đăng bài</Typography>
            <TextField
              fullWidth
              label="Tin nhắn"
              multiline
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Button variant="contained" color="secondary" fullWidth onClick={handleSendMessage} sx={{ mt: 2 }}>
              Gửi tin nhắn
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentPage;
