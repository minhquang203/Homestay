import { Menu, Search } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../Redux/state";
import "../styles/Navbar.scss";

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        <img src="/assets/logo.png" alt="logo" />
      </Link>

      <div className="navbar__search">
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton
          disabled={search === ""}
          onClick={() => navigate(`/properties/search/${search}`)}
        >
          <Search />
        </IconButton>
      </div>

      <div className="navbar__right">
        <Link to={user ? "/create-listing" : "/login"} className="navbar__host">
          + Tạo chỗ ở
        </Link>

        <div
          className="navbar__account"
          onClick={() => setDropdown((prev) => !prev)}
        >
          <Menu />
          {user?.picturePath ? (
            <Avatar src={user.picturePath} sx={{ width: 30, height: 30 }} />
          ) : (
            <Avatar sx={{ width: 30, height: 30 }} />
          )}
        </div>

        <div className={`navbar__dropdown ${dropdown ? "show" : ""}`}>
          {user ? (
            <>
              <Link to="/profile">👤 Hồ sơ</Link>
              <Link to={`/${user._id}/trips`}>✈️ Chuyến đi</Link>
              <Link to={`/${user._id}/wishList`}>❤️ Yêu thích</Link>
              <Link to={`/${user._id}/properties`}>🏡 Chỗ ở</Link>
              <Link to={`/${user._id}/reservations`}>🗓️ Đặt chỗ</Link>
              <button onClick={handleLogout}>🚪 Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
