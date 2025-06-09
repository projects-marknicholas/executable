import React, { useState } from "react";
import { insertSymptom } from "../../../api/data";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import "../../../assets/css/modal.css";

const AddSymptomPopup = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    symptom: "",
    symptom_tagalog: "",
    symptom_description: "",
    allow_image: "no",
    threshold: ""
  });
  const [loading, setLoading] = useState(false);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await insertSymptom(formData);
      
      if (result.status === 'success') {
        Swal.fire({
          title: 'Success!',
          text: result.message || 'Symptom added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 2000
        }).then(() => {
          if (onSuccess) onSuccess();
          onClose();
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to add symptom',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while adding the symptom',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <motion.div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="modal-header">
            <h1>Add New Symptom</h1>
            <button className="close-modal" onClick={onClose}>
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-input">
              <div className="item">
                <span>Symptom</span>
                <input 
                  type="text" 
                  name="symptom" 
                  id="symptom"
                  value={formData.symptom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="item">
                <span>Symptom (Tagalog)</span>
                <input 
                  type="text" 
                  name="symptom_tagalog" 
                  id="symptom_tagalog"
                  value={formData.symptom_tagalog}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="item">
                <span>Threshold</span>
                <input 
                  type="number" 
                  name="threshold" 
                  id="threshold"
                  value={formData.threshold}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="item">
                <span>Allow Image (Optional)</span>
                <select
                  name="allow_image"
                  value={formData.allow_image}
                  onChange={handleChange}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div className="item">
                <span>Symptom Description (Tagalog)</span>
                <input 
                  type="text" 
                  name="symptom_description" 
                  id="symptom_description"
                  value={formData.symptom_description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="view-pop-result-btn">
              <button 
                className="submit" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : 'Add Symptom'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddSymptomPopup;