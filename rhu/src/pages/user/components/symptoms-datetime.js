import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SymptomDateTimePopup = ({ selectedSymptom, onClose, onSubmit }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null); // State for image upload

  const handleSubmit = () => {
    const formattedDateTime = `${date} ${time}`;
    onSubmit(date, time, image); // Pass the image along with date and time
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the selected image file
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="popup"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="popup-content"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h3>Enter Date and Time for {selectedSymptom}</h3>
          <label>
            Date
            <input
              type="date"
              id="symptom_date"
              name="symptom_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Time
            <input
              type="time"
              id="symptom_time"
              name="symptom_time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>

          {/* Image upload for Rashes */}
          {selectedSymptom === "Rashes" && (
            <label>
              Upload Image of Rashes
              <input
                type="file"
                id="rashes_image"
                name="rashes_image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <div className='image-preview'>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Rashes Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                  />
                </div>
              )}
            </label>
          )}

          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SymptomDateTimePopup;