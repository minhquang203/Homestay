import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../Redux/state";
import "../styles/Login.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3002/auth/google", {
        method: "GET",
        credentials: "include",
      });
      
      const data = await response.json();

      if (response.ok) {
        // Lưu thông tin người dùng và token vào Redux
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/"); // Điều hướng về trang chủ
      } else {
        setErrorMessage("Đăng nhập Google thất bại.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi đăng nhập với Google.");
    }
  };

  // Xử lý đăng nhập qua email và mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loggedInData = await response.json();

      if (response.ok) {
        dispatch(
          setLogin({
            user: loggedInData.user,
            token: loggedInData.token,
          })
        );
        navigate("/"); // Điều hướng về trang chủ
      } else {
        setErrorMessage(loggedInData.message || "Đã xảy ra lỗi khi đăng nhập.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi đăng nhập.");
    }
  };

  useEffect(() => {
    // Kiểm tra xem đã đăng nhập từ trước không, nếu có thì chuyển đến trang chủ
    const storedToken = localStorage.getItem("token");  // Hoặc check trực tiếp trong Redux store
    if (storedToken) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="login">
      <div className="login__content">
        <form className="login__form" onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <p className="login__error">{errorMessage}</p>}
          <button type="submit">Đăng nhập</button>
          <button
            type="button"
            className="login__google"
            onClick={handleGoogleLogin}
          >
            Đăng nhập bằng Google
          </button>
          <a href="/register">Không có tài khoản? Đăng ký tại đây</a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
