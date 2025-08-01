import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left side: Logo and copyright */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          {/* Clickable logo only */}
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-[#01D6FF] hover:opacity-80 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
          <span>© {new Date().getFullYear()} PYF Esports. All rights reserved.</span>
        </div>

        {/* Right side: Navigation links */}
        <nav className="flex flex-wrap gap-4 text-sm md:text-base">
          <Link to="/apply" className="hover:text-[#01D6FF] transition">
            Apply
          </Link>
          <Link to="/teams" className="hover:text-[#01D6FF] transition">
            Teams
          </Link>
          <Link to="/players" className="hover:text-[#01D6FF] transition">
            Players
          </Link>
          <Link to="/standings" className="hover:text-[#01D6FF] transition">
            Tournaments
          </Link>
          <Link to="/rules" className="hover:text-[#01D6FF] transition">
            Rules
          </Link>
        </nav>
      </div>
    </footer>
  );
}
