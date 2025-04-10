import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="space-y-4 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Thông tin người dùng</h2>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-1"
            >
              <Home size={18} />
              Trang chủ
            </Button>
          </div>

          {message && <p className="text-sm text-center text-blue-500">{message}</p>}

          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Họ"
          />
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Tên"
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
          />
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
          />

          <Button onClick={handleUpdate} className="w-full">
            💾 Lưu thay đổi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
