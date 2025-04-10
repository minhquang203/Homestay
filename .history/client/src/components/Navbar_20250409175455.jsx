import { AccountCircle, CalendarMonth, Favorite, Flight, Home, Logout, Menu, Person, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../Redux/state";
import "../styles/Navbar.scss";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" />
      </Link>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""} onClick={() => navigate(`/properties/search/${search}`)}>
          <Search />
        </IconButton>
      </div>

      <div className="navbar_right">
        <Link to={user ? "/create-listing" : "/login"} className="navbar_host">
          + Tạo chỗ ở
        </Link>

        <button className="navbar_account_btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <Menu />
          <Person />
        </button>

        {dropdownOpen && (
          <div className="navbar_dropdown" ref={dropdownRef}>
            {user ? (
              <>
                <Link to="/profile"><AccountCircle /> Hồ sơ cá nhân</Link>
                <Link to={`/${user._id}/trips`}><Flight /> Chuyến đi</Link>
                <Link to={`/${user._id}/wishList`}><Favorite /> Danh sách yêu thích</Link>
                <Link to={`/${user._id}/properties`}><Home /> Chỗ ở của bạn</Link>
                <Link to={`/${user._id}/reservations`}><CalendarMonth /> Đặt chỗ</Link>
                <span onClick={handleLogout}><Logout /> Đăng xuất</span>
              </>
            ) : (
              <>
                <Link to="/login"><Person /> Đăng nhập</Link>
                <Link to="/register"><Person /> Đăng ký</Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
