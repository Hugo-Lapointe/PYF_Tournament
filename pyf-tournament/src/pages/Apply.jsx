import React from "react";
import { motion } from "framer-motion";

export default function Apply() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Apply for the Tournament</h1>
        <div className="aspect-[4/3]">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScupKcmelkyBiQQCKNFV0gDfyA0Ebv0SxtmvGHjXK88AQS9yw/viewform"
            width="100%"
            height="700"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Tournament Application Form"
            className="w-full h-full"
            allowFullScreen
          >
            Loading…
          </iframe>
        </div>
      </div>
    </motion.div>
  );
}