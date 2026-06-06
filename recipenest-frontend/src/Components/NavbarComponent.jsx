import React from "react";
import "../Css/Navbar.css";
import logo from "../pictures/logo.jpg";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbarComponent">
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="navlinkscenter">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/chef">Chef</Link></li>
          <li><Link to="#">Food</Link></li>
         </ul>
      </div> 
      <div className="navlinksright">
        <ul>
          <li><Link to="/login">Login</Link></li> 
          <li><Link to="/register">SignUp</Link></li>
        </ul>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
