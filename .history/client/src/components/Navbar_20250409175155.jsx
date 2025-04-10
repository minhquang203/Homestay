import { Menu, Person, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../Redux/state";
import "../styles/Navbar.scss";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const [search, setSearch] = useState("");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" className="navbar_logo" />
      </Link>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""} onClick={() => navigate(`/properties/search/${search}`)}>
          <Search className="navbar_icon" />
        </IconButton>
      </div>

      <div className="navbar_right">
        <Link to={user ? "/create-listing" : "/login"} className="navbar_host">
          + Tạo chỗ ở
        </Link>

        <button
          className="navbar_account_btn"
          onClick={() => setDropdownMenu((prev) => !prev)}
        >
          <Menu />
          <Person />
        </button>

        <div className={`navbar_dropdown ${dropdownMenu ? "active" : ""}`}>
          {user ? (
            <>
              <Link to="/profile">👤 Hồ sơ cá nhân</Link>
              <Link to={`/${user._id}/trips`}>✈️ Chuyến đi</Link>
              <Link to={`/${user._id}/wishList`}>❤️ Danh sách yêu thích</Link>
              <Link to={`/${user._id}/properties`}>🏠 Chỗ ở của bạn</Link>
              <Link to={`/${user._id}/reservations`}>📅 Đặt chỗ</Link>
              <span onClick={handleLogout}>🚪 Đăng xuất</span>
            </>
          ) : (
            <>
              <Link to="/login">🔐 Đăng nhập</Link>
              <Link to="/register">📝 Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;