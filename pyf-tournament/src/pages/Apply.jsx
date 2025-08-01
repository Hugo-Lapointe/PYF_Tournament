import React from "react";
import { motion } from "framer-motion";

export default function Apply() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-4xl bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center mb-6"
          style={{ color: "#017bbd" }}
        >
          Apply for the Tournament
        </h1>
        <p className="text-center mb-8 text-lg text-gray-300">
          Fill out the form below to enter your name into upcoming tournaments.
        </p>
        <div className="w-full">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScupKcmelkyBiQQCKNFV0gDfyA0Ebv0SxtmvGHjXK88AQS9yw/viewform?embedded=true"
            title="Tournament Application Form"
            frameBorder="0"
            allowFullScreen
            className="rounded-xl border-2 border-[#017bbd]"
            style={{
              width: "100%",
              height: "800px",       
              maxWidth: "100%",
              minHeight: "500px",
            }}
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
}
