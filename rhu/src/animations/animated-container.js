import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AnimatedContainer = ({ children, animationKey, variants, className }) => {
  const defaultVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        className={className}
        variants={variants || defaultVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
