import React, { useState } from "react";
import "../styles/Profile.scss";

const Profile = () => {
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [updateMessage, setUpdateMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Updated User:", editedUser);
    setUpdateMessage("Cập nhật thành công!");

    setTimeout(() => {
      setUpdateMessage("");
    }, 3000);
  };

  const handleLogout = () => {
    console.log("Đăng xuất");
  };

  return (
    <div className="profile">
      <h2>Thông tin người dùng</h2>

      {updateMessage && <p className="update-message">{updateMessage}</p>}

      <div>
        <label>Tên:</label>
        <input
          type="text"
          name="name"
          value={editedUser.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={editedUser.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Địa chỉ:</label>
        <input
          type="text"
          name="address"
          value={editedUser.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          value={editedUser.phone}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSave}>Lưu thông tin</button>
      <button className="logout-button" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
};

export default Profile;