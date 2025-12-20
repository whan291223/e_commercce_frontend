import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const token = sessionStorage.getItem("jwt_token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    sessionStorage.removeItem("jwt_token");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newTheme = html.classList.toggle("dark");

    setIsDark(newTheme);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-linear-to-r from-gray-800 via-gray-900 to-black shadow-md">
      <div className="text-white text-2xl font-bold tracking-wide">
        E-Com-react
      </div>

      <div className="flex gap-6 items-center">
        {isLoggedIn && (
          <NavLink
            to="/customer"
            end
            className={({ isActive }) =>
              `text-gray-300 hover:text-white transition-colors duration-200 ${
                isActive ? "border-b-2 border-white pb-1" : ""
              }`
            }
          >
            Customer View
          </NavLink>
        )}

        {isLoggedIn && (
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `text-gray-300 hover:text-white transition-colors duration-200 ${
                isActive ? "border-b-2 border-white pb-1" : ""
              }`
            }
          >
            Admin View
          </NavLink>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        )}

        <button
          onClick={toggleDarkMode}
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
        >
          {isDark ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
