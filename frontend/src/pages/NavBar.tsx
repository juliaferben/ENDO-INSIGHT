import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-links">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Patient Analysis
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/bayesian"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Bayesian Network
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/model-info"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Model Info
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
