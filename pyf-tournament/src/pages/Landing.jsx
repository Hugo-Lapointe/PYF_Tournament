import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col justify-center items-center min-h-screen px-6 text-center text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      {/* Optional glowing circle background */}
      <div className="absolute w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse top-10 left-10" />
      <div className="absolute w-96 h-96 bg-indigo-400 opacity-10 rounded-full blur-3xl animate-pulse bottom-10 right-10" />

      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        Welcome to the <span className="text-blue-400">PYF</span> Esports Hub
      </motion.h1>

      <motion.p
        className="max-w-2xl mb-8 text-lg md:text-xl text-slate-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        Join the action, show your skills, and climb to the top of the leaderboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <Link
          to="/apply"
          className="bg-[#017bbd] hover:bg-[#016aa3] transition-colors px-10 py-4 rounded text-xl font-semibold shadow-lg hover:animate-none"
        >
          Apply for a Tournament
        </Link>
      </motion.div>
    </motion.div>
  );
}
