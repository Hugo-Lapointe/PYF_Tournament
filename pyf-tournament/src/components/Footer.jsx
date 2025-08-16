import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left side: Logo and copyright */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          {/* Clickable logo image */}
          <Link to="/">
            <img
              src="/images/Logo_full_transp.png" 
              alt="PYF Esports Logo"
              className="h-25 w-25 object-contain hover:opacity-80 transition"
            />
          </Link>
          <span>© {new Date().getFullYear()} PYF Esports. All rights reserved.</span>
        </div>

        {/* Right side: Navigation links */}
        <nav className="flex flex-wrap gap-4 text-sm md:text-base">
          <Link to="/teams" className="hover:text-[#017bbd] transition-colors duration-300">
            Teams
          </Link>
          <Link to="/standings" className="hover:text-[#017bbd] transition-colors duration-300">
            Tournaments
          </Link>
          <Link to="/rules" className="hover:text-[#017bbd] transition-colors duration-300">
            Rules
          </Link>
        </nav>
      </div>
    </footer>
  );
}
