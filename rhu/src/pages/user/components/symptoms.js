import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { AnimatePresence, motion } from 'framer-motion';
import { reportSymptoms, fetchRegistersByUserId, getSymptoms } from '../../../api/data'; 
import SymptomDateTimePopup from './symptoms-datetime';
import TutorialGuide from './tutorial/tutorial-guide';
import useTutorial from './tutorial/use-tutorial';
import HelpButton from './tutorial/help-button';

const Symptoms = () => {
  const [formData, setFormData] = useState({
    symptoms: [],
    symptoms_description: "",
    reporting_location: "",
    date_experienced: "",
    time_experienced: "",
    selected_registers: [],
    name: [],
    rashes: null,
    lab_result: [],
    lab_file: null,
    hasLabResult: false,
  });

  const [activeTooltip, setActiveTooltip] = useState(null);
  const [registers, setRegisters] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [symptomsList, setSymptomsList] = useState([]);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [registersResult, symptomsResult] = await Promise.all([
          fetchRegistersByUserId(),
          getSymptoms()
        ]);

        if (registersResult.status === "success") {
          setRegisters(registersResult.data);
        }

        if (symptomsResult.status === "success") {
          setSymptomsList(symptomsResult.data.map(symptom => ({
            id: symptom.symptom_list_id,
            name: symptom.symptom || '',
            translation: symptom.symptom_tagalog || '',
            description: symptom.symptom_description || "No description available",
            requiresImage: symptom.allow_image === 1
          })));
        } else {
          setSymptomsList(getDefaultSymptoms());
        }
      } catch (error) {
        setSymptomsList(getDefaultSymptoms());
      } finally {
        setIsLoadingSymptoms(false);
      }
    };

    fetchData();
  }, []);

  const getDefaultSymptoms = () => [
    { id: 1, name: "Fever", translation: "Lagnat", description: "Pagtaas ng temperatura ng katawan", requiresImage: false },
    { id: 2, name: "Cough", translation: "Ubo", description: "Isang reflex action upang linisin ang lalamunan", requiresImage: false },
    { id: 3, name: "Cold", translation: "Sipon", description: "Karaniwang viral infection", requiresImage: false }
  ];

  const labList = [
    { name: "Dengue", translation: "Dengue (Petsa ng pagsusuri)", description: "Isang viral infection na dala ng lamok, na nagdudulot ng mataas na lagnat, pananakit ng katawan, at pagdurugo." },
    { name: "Malaria", translation: "Malarya", description: "Isang sakit na dala ng lamok, na nagdudulot ng pana-panahong lagnat, panginginig, at pagpapawis." },
    { name: "Leptospirosis", translation: "Leptospirosis", description: "Isang bacterial infection na nakukuha mula sa tubig o lupa na kontaminado ng ihi ng hayop, na nagdudulot ng lagnat, sakit ng ulo, at pananakit ng kalamnan." },
    { name: "Covid", translation: "Covid", description: "Isang viral infection na nakakaapekto sa respiratory system, na nagdudulot ng lagnat, ubo, hirap sa paghinga, at iba pang sintomas." },
    { name: "Other acute infectious respiratory illness", translation: "Iba pang acute infectious respiratory illness", description: "Iba pang mga sakit sa respiratory system na dulot ng impeksyon, na nagdudulot ng lagnat, ubo, at hirap sa paghinga." },
    { name: "Rabies", translation: "Rabies", description: "Isang viral infection na nakukuha mula sa kagat ng hayop, na nagdudulot ng pagbabago sa pag-uugali, paglalaway, at pagkasira ng nervous system." },
    { name: "TB", translation: "Tuberkulosis", description: "Isang bacterial infection na nakakaapekto sa baga, na nagdudulot ng matagal na ubo, lagnat, at pagbaba ng timbang." },
    { name: "Others", translation: "Iba pa", description: "Iba pang mga resulta ng lab na hindi nakalista." } 
  ];

  const filteredSymptoms = symptomsList.filter(symptom => {
    const search = searchTerm.toLowerCase();
    return (
      (symptom.name || '').toLowerCase().includes(search) ||
      (symptom.translation || '').toLowerCase().includes(search)
    );
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      if (name === "register") {
        setFormData(prev => ({
          ...prev,
          selected_registers: checked
            ? [...prev.selected_registers, value]
            : prev.selected_registers.filter(id => id !== value),
        }));
      } else if (name === "Other") {
        setIsOtherSelected(checked);
      } else if (labList.some(lab => lab.name === name)) {
        setFormData(prev => ({
          ...prev,
          lab_result: checked
            ? [...prev.lab_result, name]
            : prev.lab_result.filter(item => item !== name),
        }));
      } else {
        if (checked) {
          // Always show popup when a basic symptom is selected
          setSelectedSymptom(name);
          setPopupVisible(true);
        } else {
          setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.filter(s => !s.startsWith(name)),
          }));
        }
      }
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (name === "hasLabResult") {
      setFormData(prev => ({ ...prev, hasLabResult: value === "yes" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePopupSubmit = (date, time, image) => {
    const formattedDateTime = `${date} ${time}`;
    const symptomWithDateTime = `${selectedSymptom} (${formattedDateTime})`;

    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, symptomWithDateTime],
      rashes: image,
    }));
    setPopupVisible(false);
    setSelectedSymptom(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("symptoms", formData.symptoms.join(", "));
    formDataToSend.append("symptoms_description", formData.symptoms_description);
    formDataToSend.append("reporting_location", formData.reporting_location);
    formDataToSend.append("date_experienced", formData.date_experienced);
    formDataToSend.append("time_experienced", formData.time_experienced);
    formDataToSend.append("selected_registers", JSON.stringify(formData.selected_registers));
    formDataToSend.append("name", JSON.stringify(
      registers
        .filter(register => formData.selected_registers.includes(register.register_id))
        .map(register => ({
          name: register.name,
          address: register.complete_address,
        }))
    ));

    if (formData.rashes) formDataToSend.append("rashes", formData.rashes);
    if (formData.hasLabResult && formData.lab_file) formDataToSend.append("lab_file", formData.lab_file);
    if (formData.lab_result.length > 0) formDataToSend.append("lab_result", JSON.stringify(formData.lab_result));

    try {
      const result = await reportSymptoms(formDataToSend);
      if (result.status === 'success') {
        await Swal.fire('Success!', 'Symptoms reported successfully.', 'success');
        setFormData({
          symptoms: [],
          symptoms_description: "",
          reporting_location: "",
          date_experienced: "",
          time_experienced: "",
          selected_registers: [],
          name: [],
          rashes: null,
          lab_result: [],
          lab_file: null,
          hasLabResult: false,
        });
        setIsOtherSelected(false);
      } else {
        Swal.fire('Error!', result.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tutorialSteps = [
    {
      target: '.basic-symptoms',
      content: 'Select the symptoms you are experiencing by checking the boxes. Click the question marks for more information about each symptom.',
      placement: 'auto',
      disableBeacon: true,
    },
    {
      target: '.symptoms-basic-desc',
      content: 'Choose yes if you already have lab result for us to better understand your condition.',
      placement: 'auto',
    },
    {
      target: '.symptoms-description textarea',
      content: 'Provide additional details about your symptoms here. The more information you give, the better we can assist you.',
      placement: 'auto',
    },
    {
      target: '.location',
      content: 'Let us know where you are reporting from - either from home or elsewhere.',
      placement: 'auto',
    },
    {
      target: '.current-location',
      content: 'Select the registered locations that apply to your current situation.',
      placement: 'auto',
    },
    {
      target: '.submit',
      content: 'Once you\'ve filled out all the necessary information, click here to submit your symptoms report.',
      placement: 'auto',
    },
    {
      target: 'body',
      content: 'You can always access this tutorial again by clicking the "Help" button in the navigation.',
      placement: 'center',
    }
  ];

  const { runTour, setRunTour, tourStepIndex, setTourStepIndex, startTour } = 
    useTutorial(tutorialSteps, 'symptomsFirstVisit');

  const handleTooltipClick = (symptomName) => {
    setActiveTooltip(symptomName === activeTooltip ? null : symptomName);
  };

  return (
    <div className='report-symptoms'>
      <TutorialGuide
        run={runTour}
        setRun={setRunTour}
        steps={tutorialSteps}
        stepIndex={tourStepIndex}
        setStepIndex={setTourStepIndex}
      />
      
      <HelpButton onClick={startTour} />

      <form onSubmit={handleSubmit}>
        <div className="symptoms-search">
          <input
            type="text"
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='basic-symptoms'>
          {isLoadingSymptoms ? (
            <div className="loading-symptoms">Loading symptoms...</div>
          ) : filteredSymptoms.length > 0 ? (
            filteredSymptoms.map(({ id, name, translation, description }) => (
              <div className='item' key={id}>
                <input
                  type="checkbox"
                  name={name}
                  checked={formData.symptoms.some(s => s.startsWith(name))}
                  onChange={handleChange}
                />
                <span>
                  {name}
                  {translation && (
                    <span className="translation"> ({translation})</span>
                  )}
                  <span 
                    className="question-mark" 
                    onClick={() => handleTooltipClick(name)}
                  >
                    ?
                  </span>
                  {activeTooltip === name && (
                    <motion.div 
                      className="tooltip-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <strong>{translation}</strong><br />
                      {description}
                    </motion.div>
                  )}
                </span>
              </div>
            ))
          ) : (
            <div className="no-results">No symptoms found</div>
          )}
        </div>

        <div className='symptoms-description'>
          <span>Do you have Lab Result?<span className='tagalog'>Mayroon ka bang Resulta ng Lab?</span></span>
        </div>
        <div className='basic-symptoms symptoms-basic-desc'>
          <div className='item'>
            <input
              type="radio"
              name="hasLabResult"
              value="yes"
              checked={formData.hasLabResult === true}
              onChange={handleChange}
            />
            <span>Yes</span>
          </div>
          <div className='item'>
            <input
              type="radio"
              name="hasLabResult"
              value="no"
              checked={formData.hasLabResult === false}
              onChange={handleChange}
            />
            <span>No</span>
          </div>
        </div>

        {formData.hasLabResult && (
          <>
            <div className='symptoms-description'>
              <span>Lab Result <span className='tagalog'>Resulta ng Lab</span></span>
              <input
                type='file'
                id='lab_file'
                name='lab_file'
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="lab-submit"
                onClick={() => {
                  if (formData.lab_file) {
                    Swal.fire('Success', 'Lab result uploaded successfully.', 'success');
                  } else {
                    Swal.fire('Error', 'Please select a lab result file first.', 'error');
                  }
                }}
              >
                Upload Lab Result
              </button>
            </div>
            <div className='basic-symptoms'>
              {labList.map(({ name, translation, description }) => (
                <div className='item' key={name}>
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData.lab_result.includes(name)}
                    onChange={handleChange}
                  />
                  <span>
                    {name}
                    <span 
                      className="question-mark" 
                      onClick={() => handleTooltipClick(name)}
                    >
                      ?
                    </span>
                    {activeTooltip === name && (
                      <motion.div 
                        className="tooltip-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <strong>{translation}</strong><br />
                        {description}
                      </motion.div>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {formData.symptoms.length > 0 && (
          <div className='symptoms-description'>
            <span>Selected Symptoms <span className='tagalog'>Mga Sintomas na Napili</span></span>
            <div className='selected-symptoms-list'>
              {formData.symptoms.map((symptom, index) => (
                <AnimatePresence key={index}>
                  <motion.div 
                    className='selected-symptom-item'
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <span>{symptom}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          symptoms: prev.symptoms.filter((_, i) => i !== index)
                        }));
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                      </svg>
                    </button>
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          </div>
        )}

        <div className='symptoms-description'>
          <span>Symptoms Description <span className='tagalog'>Paglalarawan ng mga Sintomas</span></span>
          <textarea
            rows='3'
            name="symptoms_description"
            value={formData.symptoms_description}
            onChange={handleChange}
          />
        </div>

        <div className='location'>
          <p>Reporting Location <span className='tagalog'>Lokasyon ng Pag-uulat</span></p>
          <div className='basic-symptoms'>
            <div className='item'>
              <input
                type="radio"
                name="reporting_location"
                value="Reporting from Home"
                checked={formData.reporting_location === "Reporting from Home"}
                onChange={handleChange}
              />
              <span>Reporting from Home</span>
            </div>
            <div className='item'>
              <input
                type="radio"
                name="reporting_location"
                value="Outside from Home"
                checked={formData.reporting_location === "Outside from Home"}
                onChange={handleChange}
              />
              <span>Outside from Home</span>
            </div>
          </div>
        </div>

        <div className='current-location'>
          <span>Select Registers <span className='tagalog'>Piliin ang Magrehistro</span></span>
          {registers.length > 0 ? (
            registers.map((register) => (
              <div className='select-registers' key={register.register_id}>
                <input
                  type="checkbox"
                  name="register"
                  value={register.register_id}
                  checked={formData.selected_registers.includes(register.register_id)}
                  onChange={handleChange}
                />
                <span>{register.name} - {register.complete_address}</span>
              </div>
            ))
          ) : (
            <div>No register available</div>
          )}
        </div>

        <button type="submit" className="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      <AnimatePresence>
        {popupVisible && (
          <SymptomDateTimePopup
            selectedSymptom={selectedSymptom}
            onClose={() => setPopupVisible(false)}
            onSubmit={handlePopupSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Symptoms;