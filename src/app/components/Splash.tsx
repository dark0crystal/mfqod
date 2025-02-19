"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Splash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Splash screen lasts for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Hide the splash screen with fade-out animation
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-400 text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3 }}
    >
      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
       
        <motion.div
          className="text-4xl font-bold"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          مفقود
        </motion.div>
        <motion.div
          className="text-4xl font-bold"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <span className="mx-4">|</span>
        </motion.div>

        <motion.div
          className="text-4xl font-bold"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          mfqod
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
