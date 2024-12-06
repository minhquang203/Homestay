import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../Redux/state"; // Import hành động Redux
import "../styles/Login.scss";

// Function để lấy thông tin người dùng sau khi đăng nhập thành công
const fetchUserInfo = async (token, dispatch) => {
  try {
    const response = await fetch("http://localhost:3002/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Gửi token trong header
      },
    });

    const data = await response.json();

    if (response.ok) {
      // Lưu thông tin người dùng vào Redux
      dispatch(setLogin({ user: data.user, token }));
    } else {
      console.error("Không thể lấy thông tin người dùng:", data.message);
    }
  } catch (error) {
    console.error("Lỗi khi gọi API /auth/me:", error);
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = () => {
    window.open("http://localhost:3002/auth/google", "_self"); // Điều hướng đến trang đăng nhập Google
  };

  // Kiểm tra query string khi trang được load (chứa token và message)
  useEffect(() => {
    const { token, message } = queryString.parse(window.location.search);

    if (token && message === "success") {
      // Nếu có token, gọi API để lấy thông tin người dùng
      fetchUserInfo(token, dispatch);
      navigate("/"); // Điều hướng về trang chủ
    }
  }, [dispatch, navigate]);

  // Xử lý khi người dùng submit form đăng nhập
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
        // Lưu thông tin người dùng và token vào Redux
        dispatch(
          setLogin({
            user: loggedInData.user,
            token: loggedInData.token,
          })
        );
        // Gọi API /auth/me để lấy thông tin người dùng sau khi đăng nhập thành công
        fetchUserInfo(loggedInData.token, dispatch);
        navigate("/"); // Điều hướng về trang chủ
      } else {
        setErrorMessage(loggedInData.message || "Đã xảy ra lỗi khi đăng nhập.");
      }
    } catch (error) {
      setErrorMessage("Đã xảy ra lỗi khi đăng nhập.");
    }
  };

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
