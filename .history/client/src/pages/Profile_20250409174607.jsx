import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "../Redux/state";
import "../styles/Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch("http://localhost:3002/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "❌ Cập nhật thất bại.");
        return;
      }

      dispatch(setUserDetails(data.user));
      setMessage("✅ Cập nhật thành công!");
    } catch (error) {
      setMessage("❌ Lỗi kết nối đến server.");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const goToHome = () => {
    navigate("/");
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(formData.email);
    setMessage("📋 Email đã được sao chép!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="profile">
      <h2>Thông tin người dùng</h2>

      {message && <p className="message update-message">{message}</p>}

      <label>
        Họ:
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </label>

      <label>
        Tên:
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <button className="copy-button" onClick={copyEmail}>📋</button>
      </label>

      <label>
        Địa chỉ:
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </label>

      <label>
        Số điện thoại:
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>

      <div className="button-group">
        <button onClick={handleUpdate}>💾 Lưu thay đổi</button>
        <button className="back-button" onClick={goToHome}>🏠 Về trang chủ</button>
      </div>
    </div>
  );
};

export default Profile;
