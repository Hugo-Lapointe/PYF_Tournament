import React from 'react';
import { motion } from 'framer-motion';

const Standings = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <>Standings</>

    <img
              src="/images/round_robin.png"
              alt="PYF Esports Logo"
              className="h-100"
    />

    <img
              src="/images/playoffs.png"
              alt="PYF Esports Logo"
              className="h-100"
    />
  </motion.div>
);

export default Standings;
