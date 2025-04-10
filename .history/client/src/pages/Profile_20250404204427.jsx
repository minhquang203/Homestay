import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Profile.scss";

const Profile = () => {
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    avatar: null,
    password: "",
    confirmPassword: "",
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);

  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!editedUser.name) newErrors.name = "Tên không được để trống.";
    if (!editedUser.email) newErrors.email = "Email không được để trống.";
    else if (!/\S+@\S+\.\S+/.test(editedUser.email))
      newErrors.email = "Email không hợp lệ.";
    if (!editedUser.phone) newErrors.phone = "Số điện thoại không được để trống.";
    else if (!/^\d+$/.test(editedUser.phone))
      newErrors.phone = "Số điện thoại chỉ được chứa số.";
    if (editedUser.password && editedUser.password !== editedUser.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    if (window.confirm("Bạn có chắc chắn muốn lưu thông tin?")) {
      console.log("Updated User:", editedUser);
      setUpdateMessage("Cập nhật thành công!");

      setTimeout(() => {
        setUpdateMessage("");
      }, 3000);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      console.log("Đăng xuất");
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode((prev) => !prev);
  };

  const goToChangePassword = () => {
    navigate("/change-password"); // Điều hướng đến trang đổi mật khẩu
  };

  return (
    <div className="profile">
      <h2>Thông tin người dùng</h2>

      {updateMessage && <p className="update-message">{updateMessage}</p>}

      <div className="avatar-section">
        <label>Ảnh đại diện:</label>
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        {editedUser.avatar && (
          <img
            src={editedUser.avatar}
            alt="Avatar"
            className="avatar-preview"
          />
        )}
      </div>

      <div>
        <label>Tên:</label>
        <input
          type="text"
          name="name"
          placeholder="Nhập tên của bạn"
          value={editedUser.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Nhập email của bạn"
          value={editedUser.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div>
        <label>Địa chỉ:</label>
        <input
          type="text"
          name="address"
          placeholder="Nhập địa chỉ của bạn"
          value={editedUser.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          placeholder="Nhập số điện thoại của bạn"
          value={editedUser.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}
      </div>

      <button onClick={handleSave}>Lưu thông tin</button>
      <button className="logout-button" onClick={handleLogout}>
        Đăng xuất
      </button>
      <button onClick={togglePreviewMode}>
        {previewMode ? "Chỉnh sửa" : "Xem trước"}
      </button>
      <button onClick={goToChangePassword}>Đổi mật khẩu</button>

      {previewMode && (
        <div className="preview-section">
          <h3>Xem trước thông tin</h3>
          <p>Tên: {editedUser.name}</p>
          <p>Email: {editedUser.email}</p>
          <p>Địa chỉ: {editedUser.address}</p>
          <p>Số điện thoại: {editedUser.phone}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;