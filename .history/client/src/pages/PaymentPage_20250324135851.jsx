import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearPayment } from "../Redux/state";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.payment);

  const [bankCode, setBankCode] = useState(""); // Thay paymentMethod bằng bankCode

  useEffect(() => {
    if (!payment || !payment.bookingId || !payment.totalPrice || !payment.customerId) {
      alert("Dữ liệu thanh toán không hợp lệ!");
      navigate("/");
    }
  }, [payment, navigate]);

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:3002/payment/create_payment_url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: payment.bookingId,
          totalPrice: payment.totalPrice,
          customerId: payment.customerId,
          bankCode: bankCode || undefined, // Gửi bankCode, nếu không chọn thì để undefined
        }),
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

  const handleCancel = () => {
    dispatch(clearPayment());
    navigate("/");
  };

  return (
    <div>
      <h1>Chọn phương thức thanh toán</h1>
      <div>
        <label>
          <input
            type="radio"
            value=""
            checked={bankCode === ""}
            onChange={() => setBankCode("")}
          />
          Thanh toán qua VNPay (mặc định)
        </label>
        <label>
          <input
            type="radio"
            value="NCB"
            checked={bankCode === "NCB"}
            onChange={() => setBankCode("NCB")}
          />
          Ngân hàng NCB
        </label>
        <label>
          <input
            type="radio"
            value="VNPAYQR"
            checked={bankCode === "VNPAYQR"}
            onChange={() => setBankCode("VNPAYQR")}
          />
          Thanh toán qua VNPay QR
        </label>
      </div>
      <button onClick={handlePayment}>Thanh toán</button>
      <button onClick={handleCancel}>Hủy</button>
    </div>
  );
};

export default PaymentPage;