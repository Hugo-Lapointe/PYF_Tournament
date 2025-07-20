import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const activeClass = "text-blue-600 font-semibold";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TournamentHub
          </Link>

          {/* Desktop Menu */}
          <div className="flex space-x-8">
            {/* other links */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? activeClass : "text-gray-700 hover:text-blue-600"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/apply"
              className={({ isActive }) =>
                isActive ? activeClass : "text-gray-700 hover:text-blue-600"
              }
            >
              Apply
            </NavLink>
            <NavLink
              to="/players"
              className={({ isActive }) =>
                isActive ? activeClass : "text-gray-700 hover:text-blue-600"
              }
            >
              Players
            </NavLink>
            <NavLink
              to="/standings"
              className={({ isActive }) =>
                isActive ? activeClass : "text-gray-700 hover:text-blue-600"
              }
            >
              Tournaments
            </NavLink>

            {/* Conditionally show Admin or Dashboard */}
            {!isLoggedIn ? (
              <NavLink
                to="/admin-login"
                className={({ isActive }) =>
                  isActive ? activeClass : "text-gray-700 hover:text-blue-600"
                }
              >
                Admin
              </NavLink>
            ) : (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? activeClass : "text-gray-700 hover:text-blue-600"
                }
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Mobile menu button and mobile menu here, similar conditional logic can be applied */}
          {/* ... */}
        </div>
      </div>

      {/* Mobile Menu (add conditional rendering for Admin/Dashboard links here too) */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          {/* ... other mobile links */}
          {!isLoggedIn ? (
            <NavLink
              to="/admin-login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              Admin
            </NavLink>
          ) : (
            <NavLink
              to="/admin-tournament"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              Dashboard
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}