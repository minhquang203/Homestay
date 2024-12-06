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
      // Gọi API lấy thông tin người dùng từ token
      fetch("http://localhost:3002/auth/google", "_self", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            // Lưu thông tin user và token vào Redux
            dispatch(
              setLogin({
                user: data.user, // Thông tin đầy đủ của user
                token,           // Lưu token
              })
            );
            navigate("/"); // Điều hướng về trang chủ
          } else {
            console.error("Không thể lấy thông tin người dùng từ backend.");
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API lấy thông tin người dùng:", error);
        });
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
