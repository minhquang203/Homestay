import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import { Button, Card, CardContent, Container, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, totalPrice, customerId } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const handlePayment = async () => {
    try {
      const response = await fetch('http://localhost:3002/payment/create_payment_url', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, totalPrice, customerId, paymentMethod }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          alert("Không thể tạo URL thanh toán. Vui lòng thử lại.");
        }
      } else {
        const errorData = await response.json();
        alert(`Lỗi từ server: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Lỗi khi tạo URL thanh toán:", err);
      alert("Có lỗi xảy ra khi tạo đơn thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Chọn phương thức thanh toán
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Tổng tiền: {totalPrice?.toLocaleString()} VNĐ
          </Typography>
          <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <FormControlLabel 
              value="bank_transfer" 
              control={<Radio />} 
              label={<><CreditCardIcon sx={{ mr: 1 }} /> Chuyển khoản ngân hàng</>}
            />
            <FormControlLabel 
              value="system_balance" 
              control={<Radio />} 
              label={<><AccountBalanceWalletIcon sx={{ mr: 1 }} /> Nạp vào hệ thống</>}
            />
          </RadioGroup>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PaymentIcon />} 
            onClick={handlePayment}
            sx={{ mt: 3 }}
          >
            Thanh toán ngay
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentPage;
