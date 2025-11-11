// src/components/PageWrapper.jsx
import React from "react";
import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.4 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
