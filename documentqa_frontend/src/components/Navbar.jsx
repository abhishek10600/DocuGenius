import React from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiSolidLogOut } from "react-icons/bi";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const username = userData?.username || "Guest";
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(logout());
    navigate("/");
  };
  return (
    <nav className="d-flex justify-content-between align-items-center bg-black text-white navbar-custom flex-wrap">
      <div className="logo">
        <Link className="logo-link-custom" to="/dashboard">
          <h2>
            DocuGenius <sup className="nav-logo-beta bg-primary">Beta</sup>
          </h2>
        </Link>
      </div>
      <div className="navbar-content-right">
        <div className="dropdown">
          <button
            className="btn btn-navbar-custom-button dropdown-toggle d-flex justify-content-center align-items-center gap-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUser />
            {username ? username : ""}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item btn btn-light d-flex align-items-center"
                onClick={handleLogout}
                href="#"
              >
                <BiSolidLogOut size={20} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
