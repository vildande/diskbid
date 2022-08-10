import React from "react";
import { Link, NavLink } from "react-router-dom";

const setActiveLink = ({ isActive }) =>
  isActive ? "font-bold" : "hover:underline";

function Navbar({ user }) {
  return (
    <nav className="bg-gray-800">
      <div className="h-16 px-8 flex items-center">
        <Link to="/" className="text-white font-bold">
          DiskBid
        </Link>
        <div className="text-white ml-auto mr-8 items-center flex justify-center gap-10">
          <NavLink to={"/"} className={setActiveLink}>
            Home
          </NavLink>
          {user ? (
            <NavLink to="/logout" className={setActiveLink}>
              Logout
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className={setActiveLink}>
                Login
              </NavLink>
              <NavLink to="/register" className={setActiveLink}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
