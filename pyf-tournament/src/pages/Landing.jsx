import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full overflow-hidden pt-20 z-0">
        {/* Add padding-top (pt-20) to avoid covering navbar */}

        <div className="w-full h-full flex flex-col justify-center items-center px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome to the Ultimate Tournament Hub
          </h1>
          <p className="max-w-2xl mb-8 text-lg md:text-xl">
            Join the competition, showcase your skills, and track results with ease.
          </p>
          <Link
            to="/apply"
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-8 py-4 rounded text-xl font-semibold shadow-lg"
          >
            Apply for a Tournament
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
