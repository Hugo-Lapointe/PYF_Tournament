import React from "react";
import { motion } from "framer-motion";

export default function Schedule() {
  return (
    <motion.div
      className="p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-4xl font-bold text-center text-white mb-12">
        Tournament Schedule
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Round Robin */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Round Robin
          </h2>
          <img
            src="/images/round_robin.png"
            alt="Round Robin Schedule"
            className="w-full max-w-md rounded-lg border border-gray-600 object-contain"
          />
        </div>

        {/* Playoffs */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Playoffs
          </h2>
          <img
            src="/images/playoffs.png"
            alt="Playoffs Schedule"
            className="w-full max-w-md rounded-lg border border-gray-600 object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}
