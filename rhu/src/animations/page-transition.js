import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  const pageVariants = {
    initial: {
      scale: 0.9,
      opacity: 0, 
    },
    animate: {
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.1, 
        ease: "easeInOut",
      },
    },
    exit: {
      scale: 0.9, 
      opacity: 0,
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="page-transition"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
