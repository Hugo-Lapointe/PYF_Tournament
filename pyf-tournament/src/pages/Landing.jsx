import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlowingBalls from "../components/GlowingBalls";

export default function Landing() {
  return (
    <>
      <GlowingBalls />

      <motion.div
        key="landing"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center min-h-screen px-6 pt-32 pb-16 text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-visible"
      >
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center text-center max-w-4xl w-full mb-20 z-20 relative">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Welcome to the <span className="text-blue-400">PYF</span> Esports Hub
          </motion.h1>

          <motion.p
            className="max-w-2xl mb-10 text-lg md:text-xl text-slate-300"
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
              className="bg-[#017bbd] hover:bg-[#016aa3] transition-colors px-10 py-4 rounded text-xl font-semibold shadow-lg"
            >
              Apply for a Tournament
            </Link>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-blue-500 rounded-full mb-16 z-20 relative" />

        {/* Twitch Promo Section */}
        <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-4 z-20 relative">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-6 text-[#017bbd]">Watch Live on Twitch</h2>
            <p className="text-slate-300 mb-8">
              Don’t miss a moment of the action! Catch our live tournaments, shoutcasts, and behind-the-scenes on our official Twitch channel.
            </p>
            <a
              href="https://www.twitch.tv/pyfesports"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#9146FF] hover:bg-[#7a39d5] px-6 py-3 rounded-lg text-white font-semibold shadow-md transition"
            >
              Watch Now on Twitch
            </a>
          </div>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center relative">
            <img
              src="/images/Phoque_Phriends_Cover_Final.png"
              alt="Twitch Stream"
              className="rounded-xl shadow-lg"
              style={{ width: 300, height: 300, objectFit: "cover" }}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
