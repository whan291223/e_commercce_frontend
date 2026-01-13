import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { toggleCart, cartItems, clearCart } = useCart();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const token = sessionStorage.getItem("jwt_token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    sessionStorage.removeItem("jwt_token");
    clearCart();
    navigate("/shop"); // ✅ Redirect to shop instead of login
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newTheme = html.classList.toggle("dark");
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-linear-to-r from-gray-600 via-gray-700 to-gray-800 dark:from-gray-800 dark:via-gray-900 dark:to-black shadow-md">
      <Link
        to="/shop"
        className="text-white text-2xl font-bold tracking-wide cursor-pointer hover:opacity-80"
      >
        E-Com-react
      </Link>

      <div className="flex gap-6 items-center">
        {/* ✅ Shop link always visible */}
        <NavLink
          to="/shop"
          end
          className={({ isActive }) =>
            `text-gray-300 hover:text-white transition-colors duration-200 ${
              isActive ? "border-b-2 border-white pb-1" : ""
            }`
          }
        >
          Shop
        </NavLink>

        {/* ✅ Admin link only for logged-in users */}
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
            Admin
          </NavLink>
        )}

        {/* ✅ Cart button always visible */}
        <button
          onClick={toggleCart}
          className="relative p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Open Cart"
        >
          <span className="text-2xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {totalItems}
            </span>
          )}
        </button>

        {/* ✅ Login/Logout buttons */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Login
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