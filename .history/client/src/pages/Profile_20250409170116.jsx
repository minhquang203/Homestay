import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });

  const [updateMessage, setUpdateMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Lấy thông tin người dùng từ Redux store khi component được tải
  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm điều hướng về trang chủ
  const handleLogoutHome = () => {
    navigate("/");
  };

  // Hàm kiểm tra dữ liệu đầu vào
  const validateInputs = () => {
    const newErrors = {};
    if (!editedUser.name) newErrors.name = "Tên không được để trống.";
    if (!editedUser.email) newErrors.email = "Email không được để trống.";
    else if (!/\S+@\S+\.\S+/.test(editedUser.email))
      newErrors.email = "Email không hợp lệ.";
    if (!editedUser.phone) newErrors.phone = "Số điện thoại không được để trống.";
    else if (!/^\d+$/.test(editedUser.phone))
      newErrors.phone = "Số điện thoại chỉ được chứa số.";
    return newErrors;
  };

  // Hàm lưu thông tin người dùng
  const handleSave = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Gửi yêu cầu PUT đến server
      const response = await fetch("http://localhost:3002/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token để xác thực
        },
        body: JSON.stringify(editedUser), // Gửi dữ liệu người dùng
      });

      const data = await response.json();
      if (response.ok) {
        setUpdateMessage("Cập nhật thành công!");
      } else {
        setUpdateMessage(data.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      setUpdateMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
    }

    // Xóa thông báo sau 3 giây
    setTimeout(() => {
      setUpdateMessage("");
    }, 3000);
  };

  return (
    <div className="profile">
      {user ? (
        <div>
          <h2>Thông tin người dùng</h2>

          {updateMessage && <p className="update-message">{updateMessage}</p>}

          <div>
            <label>
              Tên:
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </label>
          </div>
          <div>
            <label>
              Địa chỉ:
              <input
                type="text"
                name="address"
                value={editedUser.address}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>
              Số điện thoại:
              <input
                type="text"
                name="phone"
                value={editedUser.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </label>
          </div>
          <button onClick={handleSave}>Lưu thông tin</button>
          <button onClick={handleLogoutHome}>Quay về trang chủ</button>
        </div>
      ) : (
        <p>Vui lòng đăng nhập để xem thông tin.</p>
      )}
    </div>
  );
};

export default Profile;