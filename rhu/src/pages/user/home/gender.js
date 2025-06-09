import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import Age from "../components/category/age";
import MaleSvg from "../../../assets/svg/individual.svg";
import FemaleSvg from "../../../assets/svg/female.svg";
import { updateGender } from "../../../api/data";

const UserGender = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const [selectedGender, setSelectedGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userGender = userData?.gender || null;

    // If gender exists and we're not in edit mode, redirect immediately
    if (!isEdit && userGender) {
      navigate("/user");
      return;
    }

    setSelectedGender(userGender);
  }, [navigate, isEdit]);

  const handleGenderClick = async (gender) => {
    setLoading(true);
      
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const user_id = userData?.user_id;
  
      if (!user_id) {
        console.error("User ID not found");
        setLoading(false);
        return;
      }
  
      const response = await updateGender({ user_id, sex: gender });
  
      if (response?.status === "success") {
        const updatedUserData = { ...userData, gender };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setSelectedGender(gender);
  
        if (gender === "Female") {
          setShowAgeModal(true);
        } else if (isEdit) {
          Swal.fire({
            icon: "success",
            title: "Gender Updated!",
            text: "Your gender has been successfully updated.",
          });
          navigate(-1);
        } else {
          navigate("/user");
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response?.message || "Failed to update gender.",
        });
      }
    } catch (error) {
      console.error("Gender update error:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Error updating gender. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  // If we're redirecting, don't render anything
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  if (!isEdit && userData?.gender) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          transition={{ duration: 0.5 }}
          className="loading-container"
        >
          <div className="loading-text">Loading...</div>
        </motion.div>
      ) : showAgeModal ? (
        <motion.div
          key="age"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <Age onClose={() => setShowAgeModal(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="gender"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className="gender">
            <motion.div
              className="gender-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>{isEdit ? "Update Your Gender" : "Select Your Gender"}</h3>
            </motion.div>

            <motion.div className="gender-grid">
              {[
                { img: MaleSvg, label: "Male" },
                { img: FemaleSvg, label: "Female" },
              ].map(({ img, label }, index) => (
                <motion.div
                  key={index}
                  className="item"
                  variants={containerVariants}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleGenderClick(label)}
                >
                  <div>
                    <img src={img} alt={label} />
                    <span>{label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserGender;