import React, { useState } from "react";

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Đổi mật khẩu thành công!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        setMessage(data.message || "Đổi mật khẩu thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div className="change-password">
      <h2>Đổi mật khẩu</h2>
      <div>
        <label>Mật khẩu cũ:</label>
        <input
          type="password"
          name="oldPassword"
          placeholder="Nhập mật khẩu cũ"
          value={passwordData.oldPassword}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Mật khẩu mới:</label>
        <input
          type="password"
          name="newPassword"
          placeholder="Nhập mật khẩu mới"
          value={passwordData.newPassword}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Xác nhận mật khẩu mới:</label>
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Xác nhận mật khẩu mới"
          value={passwordData.confirmNewPassword}
          onChange={handleChange}
        />
      </div>
      {message && <p className="message">{message}</p>}
      <button onClick={handleSubmit}>Đổi mật khẩu</button>
    </div>
  );
};

export default ChangePassword;