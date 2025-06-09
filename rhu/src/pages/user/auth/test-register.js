import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PageTransition from '../../../animations/page-transition';
import Swal from 'sweetalert2';
import { register } from "../../../api/auth";
import Logo from '../../../assets/svg/favicon.png';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "", 
    date_of_birth: "",
    email: "",
    password: "",
    confirm_password: "",
    latitude: "",
    longitude: "",
    selfie: null
  });

  const [showMap, setShowMap] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('user');
  const [marker, setMarker] = useState(null);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    document.title = 'Register - RHU Disease Monitoring';
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const showDetailedDisclaimer = () => {
    Swal.fire({
      title: 'Data Collection & Privacy Notice',
      html: `<div style="text-align: left; max-height: 60vh; overflow-y: auto;">
        <h3>Purpose of Data Collection</h3>
        <p>We collect your personal and health information to:</p>
        <ul>
          <li>Provide accurate disease monitoring and health services</li>
          <li>Track and analyze community health trends</li>
          <li>Deliver personalized health notifications</li>
          <li>Improve public health response systems</li>
        </ul>

        <h3>Data We Collect</h3>
        <ul>
          <li><strong>Personal Information:</strong> Name, birth date, contact details</li>
          <li><strong>Location Data:</strong> For disease mapping and contact tracing</li>
          <li><strong>Health Information:</strong> Symptoms, medical history (if provided)</li>
          <li><strong>Biometric Data:</strong> Selfie for identity verification</li>
        </ul>

        <h3>How We Use Your Data</h3>
        <ul>
          <li>For public health monitoring and analysis</li>
          <li>To provide personalized health recommendations</li>
          <li>For contact tracing when necessary</li>
          <li>To improve our health services</li>
        </ul>

        <h3>Data Protection</h3>
        <ul>
          <li>All data is encrypted and stored securely</li>
          <li>Only authorized health personnel can access sensitive information</li>
          <li>We comply with the Data Privacy Act of 2012 (RA 10173)</li>
        </ul>

        <h3>Your Rights</h3>
        <ul>
          <li>Right to access your personal data</li>
          <li>Right to correct inaccurate information</li>
          <li>Right to request deletion of your data</li>
          <li>Right to withdraw consent (may limit service functionality)</li>
        </ul>

        <p style="font-weight: bold; margin-top: 1rem;">
          By registering, you acknowledge that you have read and understood this notice 
          and consent to the collection and processing of your personal data as described.
        </p>
      </div>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'I Understand and Accept',
      cancelButtonText: 'Decline',
      reverseButtons: true,
      scrollbarPadding: false,
      width: '800px'
    }).then((result) => {
      if (result.isConfirmed) {
        setAcceptedDisclaimer(true);
        proceedWithRegistration();
      } else {
        Swal.fire({
          title: 'Registration Cancelled',
          text: 'You must accept the data collection terms to use this service.',
          icon: 'info'
        });
      }
    });
  };

  const proceedWithRegistration = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('date_of_birth', formData.date_of_birth);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('confirm_password', formData.confirm_password);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);
      
      if (formData.selfie) {
        const blob = await fetch(formData.selfie).then(res => res.blob());
        const file = new File([blob], 'selfie.png', { type: 'image/png' });
        formDataToSend.append('selfie', file);
      }

      const result = await register(formDataToSend);
      
      if (result.status === 'success') {
        Swal.fire('Success!', result.message, 'success');
        navigate('/');
      } else {
        Swal.fire('Error!', result.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'An error occurred during registration.', 'error');
      console.error('Registration error:', error);
    }
  };

  const handleSetAddress = () => {
    setShowMap(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({...prev, latitude, longitude}));
        initMap(latitude, longitude);
      },
      () => initMap(14.5995, 120.9842)
    );
  };

  const initMap = (lat, lng) => {
    const map = L.map("map-container").setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const newMarker = L.marker([lat, lng], {
      draggable: true,
      icon: L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0339A8" width="32px" height="32px">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>`,
        className: 'svg-marker-icon',
        iconSize: [32, 32]
      })
    }).addTo(map);

    setMarker(newMarker);
    newMarker.on("dragend", () => {
      const { lat, lng } = newMarker.getLatLng();
      setFormData(prev => ({...prev, latitude: lat, longitude: lng}));
    });
  };

  const handleConfirmLocation = () => {
    Swal.fire({
      title: 'Confirm Home Address',
      text: 'Is this your correct home address?',
      icon: 'question',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        setShowMap(false);
        requestCameraAccess();
      }
    });
  };

  const requestCameraAccess = async () => {
    try {
      // First check permission state
      const permissionResult = await navigator.permissions.query({ name: 'camera' });
      
      if (permissionResult.state === 'denied') {
        showCameraDeniedAlert();
        return;
      }

      // Try to get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode }
      });
      
      setShowCamera(true);
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      handleCameraError(err);
    }
  };

  const handleCameraError = (error) => {
    console.error('Camera error:', error);
    
    Swal.fire({
      title: 'Camera Access Required',
      html: `
        <p>We need access to your camera for identity verification.</p>
        <p>Please enable camera permissions to continue registration.</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Try Again',
      cancelButtonText: 'Cancel Registration',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        requestCameraAccess();
      } else {
        // Reset the registration process
        setShowCamera(false);
        setShowMap(false);
        setFormData(prev => ({ ...prev, selfie: null }));
      }
    });
  };

  const showCameraDeniedAlert = () => {
    Swal.fire({
      title: 'Camera Permission Denied',
      html: `
        <p>You have permanently denied camera access.</p>
        <p>To continue registration:</p>
        <ol>
          <li>Go to your browser settings</li>
          <li>Find the camera permissions for this site</li>
          <li>Change the setting to "Allow"</li>
          <li>Refresh the page and try again</li>
        </ol>
      `,
      icon: 'error',
      confirmButtonText: 'I Understand',
    }).then(() => {
      // Reset the registration process
      setShowCamera(false);
      setShowMap(false);
      setFormData(prev => ({ ...prev, selfie: null }));
    });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureSelfie = () => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/png');
    setFormData(prev => ({...prev, selfie: dataUrl}));
    
    stopCamera();
    setShowCamera(false);
  };

  const toggleCamera = async () => {
    stopCamera();
    setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    await requestCameraAccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      Swal.fire('Error!', 'Passwords do not match.', 'error');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      Swal.fire('Error!', 'Please set your home address first.', 'error');
      return;
    }

    if (!formData.selfie) {
      Swal.fire('Error!', 'Please take a verification selfie.', 'error');
      return;
    }

    if (!acceptedDisclaimer) {
      showDetailedDisclaimer();
      return;
    }

    proceedWithRegistration();
  };

  return (
    <PageTransition>
      <div className='user'>
        <div className="main-log">
          <div className="top">
            <div className='app'>
              <div className="logo">
                <img src={Logo} alt='Logo'/>
              </div>
              <div className="app-name">
                <div>Symp TrackLB</div>
              </div>
            </div>
          </div>
          
          {!showMap && !showCamera ? (
            <form className="bottom" onSubmit={handleSubmit}>
              <div className='under'>
                <div className="form-group">
                  <div className="inputs">
                    <label htmlFor="first_name">First Name<br/>
                      <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </label><br/>
                    <label htmlFor="last_name">Last Name<br/>
                      <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </label><br/>
                    <label htmlFor="email">Email<br/>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label><br/>
                    <label htmlFor="date_of_birth">Date of Birth<br/>
                      <input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                    </label><br/>
                    <label htmlFor="password">Password<br/>
                      <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="8" />
                    </label><br/>
                    <label htmlFor="confirm_password">Confirm Password<br/>
                      <input type="password" id="confirm_password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required minLength="8" />
                    </label><br/>
                    
                    <input type="hidden" id="latitude" name="latitude" value={formData.latitude} />
                    <input type="hidden" id="longitude" name="longitude" value={formData.longitude} />

                    {formData.selfie && (
                      <div className="selfie-preview">
                        <p>Selfie captured</p>
                        <img src={formData.selfie} alt="Selfie preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      </div>
                    )}

                    {formData.latitude && formData.longitude && formData.selfie ? (
                      <button type="submit" className="register-btn">Complete Registration</button>
                    ) : (
                      <div className="registration-steps">
                        {!formData.latitude && (
                          <button type="button" onClick={handleSetAddress} className="step-btn">
                            Step 1: Set Home Address
                          </button>
                        )}
                        {formData.latitude && !formData.selfie && (
                          <button type="button" onClick={requestCameraAccess} className="step-btn">
                            Step 2: Take Verification Selfie
                          </button>
                        )}
                      </div>
                    )}

                    <div className='flex-nav'>
                      <Link to='/auth/user/login' className='log'>Already have an account? Login</Link>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : showMap ? (
            <div className="map-popup">
              <div id="map-container" style={{ height: "400px", width: "100%" }}></div>
              <button onClick={handleConfirmLocation} className='map-popup-btn'>Confirm Location</button>
            </div>
          ) : (
            <div className="camera-popup">
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '400px' }} />
              <div className="camera-controls">
                <button type="button" onClick={toggleCamera} className="camera-btn">
                  <i className="fas fa-sync-alt"></i> Switch Camera
                </button>
                <button type="button" onClick={captureSelfie} className="camera-btn primary">
                  <i className="fas fa-camera"></i> Take Photo
                </button>
                <button type="button" onClick={() => {
                  stopCamera();
                  setShowCamera(false);
                  setShowMap(true);
                }} className="camera-btn cancel">
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
              <div className="camera-instructions">
                <p>Please center your face in the frame</p>
                <p>Ensure good lighting and remove sunglasses</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default UserRegister;