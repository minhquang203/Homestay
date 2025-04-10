import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { setUserDetails } from "../Redux/state";

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-xl shadow-lg border border-gray-200">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Thông tin người dùng</h2>

          {message && (
            <p className="text-center text-sm font-medium text-blue-600">{message}</p>
          )}

          <Input
            type="text"
            name="firstName"
            placeholder="Họ"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Tên"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              ⬅️ Về trang chủ
            </Button>
            <Button onClick={handleUpdate}>💾 Lưu thay đổi</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
