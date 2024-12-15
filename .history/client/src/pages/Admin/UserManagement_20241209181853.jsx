import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  // Gọi API để lấy danh sách người dùng
  useEffect(() => {
    fetch("http://localhost:3002/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu người dùng:", error));
  }, []);

  // Hàm xử lý xóa người dùng
  const handleDelete = (userId) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      fetch(`http://localhost:3002/api/users/${userId}`, { method: "DELETE" })
        .then(() => {
          setUsers(users.filter((user) => user.id !== userId));
          alert("Xóa thành công!");
        })
        .catch((error) => console.error("Lỗi khi xóa người dùng:", error));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý người dùng</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(user.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserManagement;
