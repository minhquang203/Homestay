import { Menu, Person, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../Redux/state";
import "../styles/Navbar.scss";
import variables from "../styles/variable.scss";

const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" />
      </Link>

      <div className="navbar_search">
        <input type="text" placeholder="search...." />
        <IconButton>
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {/* Hiển thị điều kiện tùy theo trạng thái người dùng */}
        <Link to={user ? "/create-listing" : "/login"} className="navbar_right_host">
          Trở thành Chủ nhà
        </Link>

        {/* Nút tài khoản để mở menu thả xuống */}
        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu((prev) => !prev)} // Chuyển đổi trạng thái menu thả xuống
        >
          <Menu sx={{ color: variables.darkgrey }} />
          <Person sx={{ color: variables.darkgrey }} />
        </button>

        {/* Menu thả xuống cho người dùng đã đăng nhập */}
        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to="/profile">Thông Tin</Link>
            <Link to={`/${user._id}/trips`}>Trip List</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            <Link to={`/${user._id}/properties`}>Property List</Link>
            <Link to={`/${user._id}/reservations`}>Reservation List</Link>
            <Link to="/login" onClick={handleLogout}>
              Đăng xuất
            </Link>
          </div>
        )}

        {/* Menu thả xuống cho người dùng chưa đăng nhập */}
        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
