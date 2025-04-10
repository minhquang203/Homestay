import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogOut, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setUserDetails } from "../Redux/state";

const Profile = () => {
  const dispatch = useDispatch();
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
      } else {
        dispatch(setUserDetails(data.user));
        setMessage("✅ Cập nhật thành công!");
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối đến server.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Thông tin người dùng</h2>

      {message && (
        <div className="text-center text-sm mb-4 text-blue-600 font-medium">
          {message}
        </div>
      )}

      <Card className="p-6 shadow-md">
        <CardContent className="grid gap-4">
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
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

          <div className="flex gap-4 mt-4">
            <Button onClick={handleUpdate} disabled={loading} className="w-full">
              <Save className="w-4 h-4 mr-2" /> {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>

            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
