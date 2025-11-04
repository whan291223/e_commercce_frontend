// top panel of the website

import React from "react";
import {Navlink} from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
        <div className="nav-brand">
            E-Com-react
        </div>
        <div className="nav-links">
            <Navlink to="/">Customer View</Navlink>
            <Navlink to="/admin">Admin View</Navlink>
        </div>

        </nav>
    )
}

export default Navbar;