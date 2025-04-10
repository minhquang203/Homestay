import { Button, Card, CardContent, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { bookingId, totalPrice, customerId, hostId } = location.state || {};

  if (!bookingId || !totalPrice || !customerId || !hostId) {
    return <Typography variant="h6" color="error">Dữ liệu thanh toán không hợp lệ.</Typography>;
  }

  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [message, setMessage] = useState('');

  const handlePayment = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3002/payment/create_payment_url', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, totalPrice, customerId, paymentMethod }),
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
  }, [bookingId, totalPrice, customerId, paymentMethod]);

  const handleSendMessage = useCallback(async () => {
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
  }, [customerId, hostId, message]);

  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Chọn phương thức thanh toán</Typography>
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
      </CardContent>
    </Card>
  );
};

export default PaymentPage;
