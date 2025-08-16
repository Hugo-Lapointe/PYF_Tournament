import React from "react";
import { motion } from "framer-motion";

export default function Results() {
  // Example default results data
  const results = [
    { match: "Team A vs Team B", score: "2 - 1", time: "18:00" },
    { match: "Team C vs Team D", score: "0 - 2", time: "18:00" },
    { match: "Team E vs Team F", score: "1 - 1", time: "18:00" },
  ];

  return (
    <motion.div
      className="min-h-screen w-full p-8"
      style={{ background: "linear-gradient(135deg, #01bbcf, #00719f)" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-4xl font-bold text-center text-slate-800 mb-12 drop-shadow-lg">
        Latest Results
      </h1>

      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {results.length === 0 ? (
          <p className="text-white text-center text-lg">
            No results available yet.
          </p>
        ) : (
          results.map((result, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex justify-between items-center text-white"
            >
              <div className="text-lg font-medium text-slate-800">{result.match}</div>
              <div className="text-lg font-semibold text-slate-800">{result.score}</div>
              <div className="text-sm text-gray-200 text-slate-800">{result.time}</div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
