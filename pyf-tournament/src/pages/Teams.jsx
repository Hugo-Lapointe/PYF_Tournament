import React from 'react';
import { motion } from 'framer-motion';

const Teams = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <>Teams</>
  </motion.div>
);

export default Teams;
