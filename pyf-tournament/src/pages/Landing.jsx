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
      transition={{ duration: 0.3 }}
      className="relative flex flex-col justify-center items-center min-h-screen px-6 text-center text-white bg-slate-900"
    >
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
        Welcome to the PYF Esports Tournament Hub
      </h1>
      <p className="max-w-2xl mb-8 text-lg md:text-xl">
        Join the competition, showcase your skills, and track results with ease.
      </p>
      <Link
        to="/apply"
        className="bg-[#017bbd] hover:bg-[#016aa3] transition-colors px-10 py-4 rounded text-xl font-semibold shadow-lg"
      >
        Apply for a Tournament
      </Link>
    </motion.div>
  );
}
