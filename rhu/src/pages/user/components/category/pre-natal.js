import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Assets
import YesSvg from "../../../../assets/svg/yes.svg";
import NoSvg from "../../../../assets/svg/no.svg";
import CircleSvg from "../../../../assets/svg/circles.svg";

// API
import { updateGender } from "../../../../api/data";

const PreNatal = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(async () => {
      try{
        const preNatalStatus = activeIndex === 0 ? 'yes' : 'no';
        const response = await updateGender({ pre_natal: preNatalStatus });
        if (response?.status === "success"){
          navigate("/user");
        } else {
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: response?.message || "Failed to update pre natal.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "An error occurred",
          text: "Error updating pre natal. Please try again.",
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

  return (
    loading ? (
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
    ) : <div className="gender-modal">
      <div className="gender-container">
        <img src={CircleSvg} className="bg-circles" />

        <div className="gender-info">
          <div className="top">
            <div className="middle">
              <h1>Did you take Pre-Natal check up?</h1>
              <motion.div
                className="pregnant-grid"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              >
                {[
                  { img: YesSvg, label: "Yes" },
                  { img: NoSvg, label: "No" }
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
            </div>
          </div>
          <div className="bottom">
            <button onClick={handleSubmit}>Submit</button> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreNatal;