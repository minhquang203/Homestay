import { Menu, Person, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../Redux/state";
import "../styles/Navbar.scss";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar_logo">
        <Link to="/">
          <img src="/assets/logo.png" alt="logo" />
        </Link>
      </div>

      <div className="navbar_menu">
        <Link to="/about">Giới thiệu</Link>
        <Link to="/services">Dịch vụ</Link>
        <Link to="/contact">Liên hệ</Link>
      </div>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton
          disabled={search === ""}
          onClick={() => navigate(`/properties/search/${search}`)}
        >
          <Search sx={{ color: "#ff4b5c" }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        <Link
          to={user ? "/create-listing" : "/login"}
          className="navbar_right_host"
        >
          Tạo phòng cho thuê
        </Link>

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu((prev) => !prev)}
        >
          <Menu sx={{ color: "#333" }} />
          <Person sx={{ color: "#333" }} />
        </button>

        {dropdownMenu && (
          <div
            className={`navbar_right_accountmenu ${
              dropdownMenu ? "active" : ""
            }`}
          >
            {user ? (
              <>
                <Link to="/profile">Thông Tin</Link>
                <Link to={`/${user._id}/trips`}>Danh sách chuyến đi</Link>
                <Link to={`/${user._id}/wishList`}>Yêu thích</Link>
                <Link to={`/${user._id}/properties`}>Phòng cho thuê</Link>
                <Link to={`/${user._id}/reservations`}>Đặt chỗ</Link>
                <Link to="/login" onClick={handleLogout}>
                  Đăng xuất
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">Đăng nhập</Link>
                <Link to="/register">Đăng ký</Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;