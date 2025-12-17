import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// TODO need to only show logout when already login
function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("jwt_token");

    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-linear-to-r from-gray-800 via-gray-900 to-black shadow-md">
      <div className="text-white text-2xl font-bold tracking-wide">
        E-Com-react
      </div>

      <div className="flex gap-6 items-center">
        <NavLink
          to="/customer"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white transition-colors duration-200 ${
              isActive ? "border-b-2 border-white pb-1" : ""
            }`
          }
        >
          Customer View
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white transition-colors duration-200 ${
              isActive ? "border-b-2 border-white pb-1" : ""
            }`
          }
        >
          Admin View
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
