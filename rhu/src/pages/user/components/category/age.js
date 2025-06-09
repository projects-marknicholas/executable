import { useState } from "react";
import { useNavigate } from "react-router";

// Assets
import CircleSvg from "../../../../assets/svg/circles.svg";

// Components
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Pregnant from "./pregnant";

// API
import { updateGender } from "../../../../api/data";

const Age = () => {
  const [age, setAge] = useState("");
  const [showPregnant, setShowPregnant] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAge(value);
    }
  };

  const handleNext = () => {
    setLoading(true);
    setTimeout(async () => {
      try{
        const response = await updateGender({ age: age });
        if (response?.status === "success"){
          if (age && parseInt(age, 10) >= 12 && parseInt(age, 10) <= 50) {
            setShowPregnant(true);
          } else {
            navigate("/user");
          }          
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: response?.message || "Failed to update age.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "An error occurred",
          text: "Error updating age. Please try again.",
        });
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }, 2000);
  };

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } }
  });

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
  ) : showPregnant ? (
    <motion.div
      key="pregnant"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <Pregnant />
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
              <h1>Please tell us your age</h1>
              <div className="input-wrapper">
                <motion.input
                  type="text"
                  id="age"
                  name="age"
                  placeholder="000"
                  value={age}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
            </motion.div>
          </motion.div>
          <motion.div className="bottom" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <button onClick={handleNext} variants={fadeIn(0.4)}>Next</button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Age;