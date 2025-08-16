import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import LogoutButton from "./LogoutButton";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setClick(false);
  }, [location]);

  const content = (
    <AnimatePresence>
      {click && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden block absolute top-16 w-full left-0 right-0 bg-slate-900 z-40 shadow-md"
        >
          <ul className="text-center text-xl p-6">
            <Link to="/" onClick={closeMobileMenu}>
              <li className="my-4 py-4 hover:bg-slate-800 transition-colors duration-200">
                Landing
              </li>
            </Link>
            <Link to="/teams" onClick={closeMobileMenu}>
              <li className="my-4 py-4 hover:bg-slate-800 transition-colors duration-200">
                Teams
              </li>
            </Link>
            <Link to="/players" onClick={closeMobileMenu}>
              <li className="my-4 py-4 hover:bg-slate-800 transition-colors duration-200">
                Players
              </li>
            </Link>
            <Link to="/standings" onClick={closeMobileMenu}>
              <li className="my-4 py-4 hover:bg-slate-800 transition-colors duration-200">
                Schedule
              </li>
            </Link>
            <Link to="/results" onClick={closeMobileMenu}>
              <li className="my-4 py-4 hover:bg-slate-800 transition-colors duration-200">
                Results
              </li>
            </Link>
            {/* {user && (
              <li className="my-4 py-4">
                <LogoutButton />
              </li>
            )} */}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <nav className="sticky top-0 z-[60] bg-slate-900">
      <div className="h-10vh flex justify-between items-center text-white px-6 sm:px-12 lg:py-0">
        {/* Logo */}
        <div className="flex items-center flex-1">
          <Link to="/" className="flex items-center">
            <img
              src="/images/Logo_full_transp.png"
              alt="PYF Esports Logo"
              className="h-30 w-auto md:h-30 transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 items-center justify-end font-normal">
          <ul className="flex gap-8 mr-4 text-[18px]">
            <Link to="/">
              <li className="hover:text-[#017bbd] transition-colors duration-300">Landing</li>
            </Link>
            <Link to="/teams">
              <li className="hover:text-[#017bbd] transition-colors duration-300">Teams</li>
            </Link>
            <Link to="/standings">
              <li className="hover:text-[#017bbd] transition-colors duration-300">Schedule</li>
            </Link>
            <Link to="/results">
              <li className="hover:text-[#017bbd] transition-colors duration-300">Results</li>
            </Link>
            {/* {user && <li><LogoutButton /></li>} */}
          </ul>
        </div>

        {/* Mobile Menu */}
        <div>{content}</div>

        <button className="block md:hidden z-50 transition" onClick={handleClick}>
          {click ? <FaTimes size={24} /> : <CiMenuFries size={28} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
