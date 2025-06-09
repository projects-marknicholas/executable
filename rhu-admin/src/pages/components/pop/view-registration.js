import { motion, AnimatePresence } from "framer-motion";
import "../../../assets/css/modal.css";

const ViewRegistrationPopup = ({ register, onClose }) => {
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

  return (
    <AnimatePresence>
      {register && (
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
              <h1>View register</h1>
              <button className="close-modal" onClick={onClose}>
                &times;
              </button>
            </div>
            <div className="modal-info">
              <table>
                <tbody>
                  <tr>
                    <td>Profile</td>
                    <td><img src={register.profile} alt="Profile" /></td>
                  </tr>
                  <tr>
                    <td>Registrator</td>
                    <td>{register.full_name}</td>
                  </tr>
                  <tr>
                    <td>Patient</td>
                    <td>{register.name}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{register.email}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{register.complete_address}</td>
                  </tr>
                  <tr>
                    <td>Category</td>
                    <td>{register.category}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewRegistrationPopup;