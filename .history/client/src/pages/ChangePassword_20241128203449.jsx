import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gửi yêu cầu đặt lại mật khẩu từ phía server (giả sử có API)
    try {
      const response = await fetch("http://localhost:3002/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMessage("Link đặt lại mật khẩu đã được gửi vào email của bạn.");
        setTimeout(() => navigate("/login"), 3000); // Chuyển hướng về trang login sau vài giây
      } else {
        setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="forgot-password">
      <h2>Quên Mật Khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Gửi Link Đặt Lại Mật Khẩu</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
