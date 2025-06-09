import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

// Components
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import PregnancyStarted from "./pregnancy-started";

// Assets
import PregnantSvg from "../../../../assets/svg/pregnant.svg";
import NotPregnantSvg from "../../../../assets/svg/not-pregnant.svg";
import CircleSvg from "../../../../assets/svg/circles.svg";

// API
import { updateGender } from "../../../../api/data";

const Pregnant = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showPregnancyStarted, setShowPregnancyStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setLoading(true);
    setTimeout(async () => {
      try{
        const pregnantStatus = activeIndex === 0 ? 'yes' : 'no';
        const response = await updateGender({ pregnant: pregnantStatus });
        if (response?.status === "success"){
          if (activeIndex === 0) { 
            setShowPregnancyStarted(true);
          } else {
            navigate("/user"); 
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: response?.message || "Failed to update pregnant.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "An error occurred",
          text: "Error updating pregnant. Please try again.",
        });
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }, 2000);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
  };

  return loading ? (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.5 } }}
        id="wifi-loader"
      >
        <svg className="circle-outer" viewBox="0 0 86 86">
          <circle className="back" cx="43" cy="43" r="40"></circle>
          <circle className="front" cx="43" cy="43" r="40"></circle>
          <circle className="new" cx="43" cy="43" r="40"></circle>
        </svg>
        <svg className="circle-middle" viewBox="0 0 60 60">
          <circle className="back" cx="30" cy="30" r="27"></circle>
          <circle className="front" cx="30" cy="30" r="27"></circle>
        </svg>
        <svg className="circle-inner" viewBox="0 0 34 34">
          <circle className="back" cx="17" cy="17" r="14"></circle>
          <circle className="front" cx="17" cy="17" r="14"></circle>
        </svg>
        <div className="text" data-text="Loading"></div>
      </motion.div>
    </motion.div>
  ) : showPregnancyStarted ? (
    <motion.div
      key="pregnancy_started"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <PregnancyStarted />
    </motion.div>
  ) : (
    <motion.div
      className="gender-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="gender-container">
        <motion.img 
          src={CircleSvg} 
          className="bg-circles"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        />

        <motion.div className="gender-info">
          <motion.div className="top">
            <motion.div className="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h1>Are you Pregnant?</h1>
              <motion.div
                className="pregnant-grid"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {[
                  { img: PregnantSvg, label: "Yes" },
                  { img: NotPregnantSvg, label: "No" }
                ].map(({ img, label }, index) => (
                  <motion.div
                    key={index}
                    className={`item ${activeIndex === index ? "active" : ""}`}
                    data-label={label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveIndex(index)}
                  >
                    <div>
                      <img src={img} alt={label} />
                      <span>{label}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div className="bottom" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <button onClick={handleNext}>Next</button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Pregnant;