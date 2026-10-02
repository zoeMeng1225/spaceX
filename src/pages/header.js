import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/space_logo.svg";

function Header() {
  return (
    <div className="header-wrapper">
      <Link to="/">
        <span className="header-span">
          <img src={logo} alt="Back to home" />
        </span>
      </Link>
    </div>
  );
}

export default Header;
