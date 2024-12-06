import queryString from "query-string";
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
  const handleGoogleLogin = () => {
    window.open("http://localhost:3002/auth/google", "_self");
  };

  // Kiểm tra query string khi trang được load
  useEffect(() => {
    const { token, message } = queryString.parse(window.location.search);

    if (token && message === "success") {
      // Lưu token và điều hướng về trang chủ
      dispatch(
        setLogin({
          user: { _id: user._id, firstName: user.firstName, email: user.email }, // Cập nhật đầy đủ thông tin người dùng
          token,
        })
      );
      navigate("/"); // Điều hướng về trang chủ
    }
  }, [dispatch, navigate]);

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
