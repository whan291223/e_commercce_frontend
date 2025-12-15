// top panel of the website

import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-linear-to-r from-gray-800 via-gray-900 to-black shadow-md">
      <div className="text-white text-2xl font-bold tracking-wide">
        E-Com-react
      </div>

      <div className="flex gap-6">
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
      </div>
    </nav>
  )
}

export default Navbar;