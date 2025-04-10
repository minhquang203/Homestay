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
    navigate("/login");
  };

  const goToSearch = () => {
    if (search.trim()) navigate(`/properties/search/${search}`);
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar__logo">
        <img src="/assets/logo.png" alt="logo" />
      </Link>

      <div className="navbar__search">
        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goToSearch()}
        />
        <IconButton disabled={!search.trim()} onClick={goToSearch}>
          <Search className="navbar__icon" />
        </IconButton>
      </div>

      <div className="navbar__right">
        <Link to={user ? "/create-listing" : "/login"} className="navbar__host">
          + Tạo chỗ ở
        </Link>

        <div className="navbar__account" onClick={() => setDropdownMenu(!dropdownMenu)}>
          <Menu />
          <Person />
        </div>

        {dropdownMenu && (
          <div className="navbar__dropdown">
            {user ? (
              <>
                <Link to="/profile">🧍 Hồ sơ cá nhân</Link>
                <Link to={`/${user._id}/trips`}>✈️ Chuyến đi</Link>
                <Link to={`/${user._id}/wishList`}>❤️ Danh sách yêu thích</Link>
                <Link to={`/${user._id}/properties`}>🏡 Chỗ ở của bạn</Link>
                <Link to={`/${user._id}/reservations`}>📅 Đặt chỗ</Link>
                <Link to="/login" onClick={handleLogout}>📕 Đăng xuất</Link>
              </>
            ) : (
              <>
                <Link to="/login">🔑 Đăng nhập</Link>
                <Link to="/register">📝 Đăng ký</Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
