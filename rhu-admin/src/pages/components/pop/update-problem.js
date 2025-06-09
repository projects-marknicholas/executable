import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateReport } from "../../../api/data"; // Import the API function
import Swal from "sweetalert2";
import "../../../assets/css/modal.css";

const ProblemReportModal = ({ isOpen, onClose, report, fetchReports }) => {
  const [problemText, setProblemText] = useState("");
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

  const handleSubmit = async () => {
    if (!problemText.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Please enter a problem description.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      // Show loading alert
      Swal.fire({
        title: "Updating...",
        text: "Please wait while we update the report.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call the API directly here
      const result = await updateReport(report.symptoms_id, problemText, null); // status not being updated

      // Close loading alert
      Swal.close();

      if (result.status === "success") {
        Swal.fire({
          title: "Success!",
          text: "Report updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchReports();
        onClose(); // Close modal
        setProblemText(""); // Reset form
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "An error occurred while updating the report.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Report a Problem</h2>
              <button className="close-modal" onClick={onClose}>
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p>
                You are reporting a problem for{" "}
                <strong>{report.name}</strong>.
              </p>
              <textarea
                rows="4"
                className="body-textarea"
                placeholder="Enter problem description..."
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div className="view-pop-result-btn">
              <button className="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Updating...
                  </>
                ) : (
                  "Submit Problem"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProblemReportModal;