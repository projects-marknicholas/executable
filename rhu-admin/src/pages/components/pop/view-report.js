import { motion, AnimatePresence } from "framer-motion";
import "../../../assets/css/modal.css";

const ViewReportPopup = ({ report, onClose }) => {
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

  const openInGoogleMaps = () => {
    if (report.latitude && report.longitude) {
      const url = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
      window.open(url, "_blank");
    }
  };

  const viewRashes = () => {
    if (report.rashes) {
      const url = `https://symptracklb.com/rhu/uploads/rashes/${report.rashes}`;
      window.open(url, "_blank");
    }
  };

  const viewLabResult = () => {
    if (report.lab_file) {
      const url = `https://symptracklb.com/rhu/uploads/lab/${report.lab_file}`;
      window.open(url, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {report && (
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
              <h1>View Report</h1>
              <button className="close-modal" onClick={onClose}>
                &times;
              </button>
            </div>
            <div className="modal-info">
              <table>
                <tbody>
                  <tr>
                    <td>Profile</td>
                    <td><img src={report.profile} alt="Profile" /></td>
                  </tr>
                  <tr>
                    <td>Registrator</td>
                    <td>{report.full_name}</td>
                  </tr>
                  <tr>
                    <td>Patient</td>
                    <td>{report.name}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{report.email}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{report.address}</td>
                  </tr>
                  <tr>
                    <td>Symptoms</td>
                    <td>{report.symptoms}</td>
                  </tr>
                  <tr>
                    <td>Lab Result</td>
                    <td>{report.lab_result}</td>
                  </tr>
                </tbody>
              </table>
              <div className="view-pop-result-btn">
                {report.latitude && report.longitude && (
                  <button className="google-maps-btn" onClick={openInGoogleMaps}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    Open in Google Maps
                  </button>
                )}
                {report.rashes && (
                  <button className="google-maps-btn" onClick={viewRashes}>
                    View Rashes
                  </button>
                )}
                {report.lab_file && (
                  <button className="google-maps-btn" onClick={viewLabResult}>
                    View Lab Result
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewReportPopup;