import {
    Button, Card, CardContent, FormControlLabel, Radio,
    RadioGroup, TextField, Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
  
  const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingData = location.state;
  
    // Định nghĩa state TRƯỚC khi kiểm tra điều kiện
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
  
    // Nếu thiếu dữ liệu, điều hướng về trang trước
    useEffect(() => {
      if (!bookingData || !bookingData.bookingId || !bookingData.totalPrice || !bookingData.customerId || !bookingData.hostId) {
        alert("Dữ liệu không hợp lệ. Vui lòng thử lại!");
        navigate(-1);
      }
    }, [bookingData, navigate]);
  
    // Nếu thiếu dữ liệu, không render UI
    if (!bookingData) return null;
  
    const { bookingId, totalPrice, customerId, hostId } = bookingData;
  
    const handlePayment = async () => {
      if (paymentMethod !== "bank_transfer") {
        alert("Hiện tại chỉ hỗ trợ thanh toán qua ngân hàng.");
        return;
      }
  
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3002/payment/create_payment_url', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
            totalPrice,
            customerId,
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert(`Lỗi: ${data.message || "Không thể tạo URL thanh toán"}`);
        }
      } catch (err) {
        console.error("Lỗi khi tạo URL thanh toán:", err);
        alert("Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
      }
      setLoading(false);
    };
  
    const handleSendMessage = async () => {
      if (!message.trim()) {
        alert("Vui lòng nhập nội dung tin nhắn!");
        return;
      }
  
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3002/chat/send_message', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: customerId,
            receiverId: hostId,
            message,
          }),
        });
  
        if (response.ok) {
          alert("Tin nhắn đã được gửi thành công!");
          setMessage('');
        } else {
          alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
      } catch (err) {
        console.error("Lỗi khi gửi tin nhắn:", err);
        alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
      }
      setLoading(false);
    };
  
    return (
      <Card sx={{ maxWidth: 500, margin: 'auto', mt: 5, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Chọn phương thức thanh toán
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Tổng tiền: {totalPrice} VND
          </Typography>
          <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <FormControlLabel value="bank_transfer" control={<Radio />} label="Chuyển khoản ngân hàng" />
          </RadioGroup>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={handlePayment} 
            sx={{ mt: 2 }} 
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </Button>
  
          <Typography variant="h6" sx={{ mt: 4 }}>
            Nhắn tin với người đăng bài
          </Typography>
          <TextField
            fullWidth
            label="Tin nhắn"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            onClick={handleSendMessage} 
            sx={{ mt: 2 }} 
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi tin nhắn"}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  export default PaymentPage;
  