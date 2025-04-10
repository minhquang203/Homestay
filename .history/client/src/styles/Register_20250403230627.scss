import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra mật khẩu khớp
    setPasswordMatch(
      formData.password === formData.confirmPassword || formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Đăng ký thông thường
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      setErrorMessage("Mật khẩu không khớp.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || "Đăng ký thành công!");
        setErrorMessage("");
        navigate("/login");
      } else {
        setErrorMessage(result.message || "Đăng ký không thành công.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      setErrorMessage("Có lỗi xảy ra trong quá trình đăng ký.");
      setSuccessMessage("");
    }
  };


  return (
    <div className="register">
      <div className="register__content">
        <form className="register__content__form" onSubmit={handleSubmit}>
          <h2>Đăng Ký</h2>
          <input
            placeholder="Họ"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Tên"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Mật khẩu"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && <p style={{ color: "red" }}>Mật khẩu không khớp.</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <button type="submit" disabled={!passwordMatch}>
            ĐĂNG KÝ
          </button>
        </form>
        <a href="/login">Đã có tài khoản? Đăng nhập tại đây</a>
      </div>
    </div>
  );
};

export default RegisterPage;
