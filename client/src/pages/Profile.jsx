import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";  
import { setLogout, setUserDetails } from "../Redux/state"; 
import "../styles/Profile.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });

  const [updateMessage, setUpdateMessage] = useState("");

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

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = () => {
    console.log("Before Dispatch - Edited User:", editedUser);
    dispatch(setUserDetails(editedUser));

    // Kiểm tra state sau khi lưu
    console.log("After Dispatch - Updated User from Redux:", user);

    setUpdateMessage("Cập nhật thành công!");

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
            </label>
          </div>
          <button onClick={handleSave}>Lưu thông tin</button>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      ) : (
        <p>Vui lòng đăng nhập để xem thông tin.</p>
      )}
    </div>
  );
};

export default Profile;
