import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// CSS
import '../../../assets/css/user/test.css';

// Assets
import Logo from "../../../assets/svg/favicon.png";
import EmailSvg from "../../../assets/svg/email.svg";
import PasswordSvg from "../../../assets/svg/password.svg";
import Show from "../../../assets/svg/show.svg";
import Hide from "../../../assets/svg/hide.svg";
import NameSvg from "../../../assets/svg/name.svg";
import DateSvg from "../../../assets/svg/date.svg";

// API
import { register } from "../../../api/auth";

const TestRegister = () => {
  const navigate = useNavigate();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('user');
  const [marker, setMarker] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    document.title = 'Register - RHU Disease Monitoring';
    
    return () => {
      // Cleanup function
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapInstance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
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
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'selfie' && value) {
          formDataToSend.append(key, value);
        }
      });

      if (formData.selfie) {
        const response = await fetch(formData.selfie);
        const blob = await response.blob();
        const file = new File([blob], 'selfie.png', { type: 'image/png' });
        formDataToSend.append('selfie', file);
      }

      const result = await register(formDataToSend);
      
      if (result.status === 'success') {
        await Swal.fire({
          title: 'Success!',
          text: result.message,
          icon: 'success'
        });
        navigate('/auth/user/login');
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'An error occurred during registration.',
        icon: 'error'
      });
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
      (error) => {
        console.error('Geolocation error:', error);
        initMap(14.5995, 120.9842); // Default to Manila coordinates
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const initMap = (lat, lng) => {
    // Clean up previous map instance if exists
    if (mapRef.current) {
      mapRef.current.remove();
    }

    const map = L.map("map-container").setView([lat, lng], 15);
    mapRef.current = map;
    setMapInstance(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const customIcon = L.divIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0339A8" width="32px" height="32px">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>`,
      className: 'svg-marker-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    const newMarker = L.marker([lat, lng], {
      draggable: true,
      icon: customIcon
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
      showCancelButton: true,
      confirmButtonText: 'Yes, Continue',
      cancelButtonText: 'No, Change'
    }).then((result) => {
      if (result.isConfirmed) {
        setShowMap(false);
        // requestCameraAccess();
      }
    });
  };

  const requestCameraAccess = async () => {
    try {
      // First check if we have permission
      if (navigator.permissions) {
        const permissionResult = await navigator.permissions.query({ name: 'camera' });
        if (permissionResult.state === 'denied') {
          showCameraDeniedAlert();
          return;
        }
      }

      // Try to get camera stream
      const constraints = {
        video: { 
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setShowCamera(true);
      setPhotoCaptured(false);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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
        ${error.message ? `<p class="error-message">Error: ${error.message}</p>` : ''}
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Try Again',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        requestCameraAccess();
      } else {
        resetCameraProcess();
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
      confirmButtonText: 'OK'
    }).then(() => {
      resetCameraProcess();
    });
  };

  const resetCameraProcess = () => {
    stopCamera();
    setShowCamera(false);
    setShowMap(true);
    setFormData(prev => ({ ...prev, selfie: null }));
    setPhotoCaptured(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Draw image with potential mirror effect for front camera
    if (cameraFacingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Reset transform if we mirrored
    if (cameraFacingMode === 'user') {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setFormData(prev => ({...prev, selfie: dataUrl}));
    setPhotoCaptured(true);
  };

  const retakePhoto = async () => {
    setPhotoCaptured(false);
    setFormData(prev => ({...prev, selfie: null}));
    await requestCameraAccess();
  };

  const toggleCamera = async () => {
    stopCamera();
    setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    await requestCameraAccess();
  };

  const validateForm = () => {
    const { 
      first_name, 
      last_name, 
      date_of_birth, 
      email, 
      password, 
      confirm_password,
      latitude,
      longitude,
      selfie
    } = formData;

    if (!first_name || !last_name || !date_of_birth || !email || !password || !confirm_password) {
      Swal.fire('Error!', 'Please fill in all required fields.', 'error');
      return false;
    }

    if (password !== confirm_password) {
      Swal.fire('Error!', 'Passwords do not match.', 'error');
      return false;
    }

    if (password.length < 8) {
      Swal.fire('Error!', 'Password must be at least 8 characters long.', 'error');
      return false;
    }

    if (!latitude || !longitude) {
      Swal.fire('Error!', 'Please set your home address.', 'error');
      return false;
    }

    if (!selfie) {
      Swal.fire('Error!', 'Please take a verification selfie.', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!acceptedDisclaimer) {
      showDetailedDisclaimer();
      return;
    }

    // If disclaimer was already accepted, proceed directly
    if (acceptedDisclaimer) {
      await proceedWithRegistration();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="login-form">
      {!showMap && !showCamera ? (
        <form onSubmit={handleSubmit}>
          <div className="login-form-profile">
            <span>
              <img src={Logo} alt="Logo" width="50" height="50"/>
            </span>
            <h3>Sign up to RHU</h3>
          </div>
          
          <div className="input-form-group">
            <label htmlFor="first_name">
              <span>First Name *</span>
              <div className="input-flex-group">
                <img src={NameSvg} alt="First Name" width="20" height="20"/>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label htmlFor="last_name">
              <span>Last Name *</span>
              <div className="input-flex-group">
                <img src={NameSvg} alt="Last Name" width="20" height="20"/>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label htmlFor="date_of_birth">
              <span>Date of Birth *</span>
              <div className="input-flex-group">
                <img src={DateSvg} alt="Date of Birth" width="20" height="20"/>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </label>

            <label htmlFor="email">
              <span>Email *</span>
              <div className="input-flex-group">
                <img src={EmailSvg} alt="Email" width="20" height="20"/>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="account@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label htmlFor="password">
              <span>Password *
                {isPasswordFocused && (
                  <small style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                    Requirements: 
                    <br/>- First letter must be capital
                    <br/>- Minimum 8 characters
                    <br/>- Must contain at least one special character (!@#$%^&*)
                  </small>
                )}
              </span>
              <div className="input-flex-group">
                <img src={PasswordSvg} alt="Password" width="20" height="20"/>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="●●●●●●●●●●"
                  value={formData.password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <img 
                  src={showPassword ? Hide : Show} 
                  alt={showPassword ? "Hide Password" : "Show Password"} 
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}
                  width="20" 
                  height="20"
                />
              </div>
            </label>

            <label htmlFor="confirm_password">
              <span>Confirm Password *</span>
              <div className="input-flex-group">
                <img src={PasswordSvg} alt="Confirm Password" width="20" height="20"/>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  id="confirm_password"
                  placeholder="●●●●●●●●●●"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <img 
                  src={showConfirmPassword ? Hide : Show} 
                  alt={showConfirmPassword ? "Hide Password" : "Show Password"} 
                  onClick={toggleConfirmPasswordVisibility}
                  style={{ cursor: 'pointer' }}
                  width="20" 
                  height="20"
                />
              </div>
            </label>

            <button 
              type="button" 
              onClick={handleSetAddress}
              className="location-btn"
            >
              Set Home Address
            </button>
            <button 
              type="button" 
              onClick={() => {
                if (!formData.latitude || !formData.longitude) {
                  Swal.fire({
                    title: 'Location Required',
                    text: 'Please set your home address first before taking a selfie.',
                    icon: 'warning'
                  });
                } else {
                  requestCameraAccess();
                }
              }}
              className="selfie-btn"
            >
              Take a Selfie
            </button>

            {formData.latitude && formData.longitude && (
              <div className="location-confirmed">
                <i className="fas fa-check-circle"></i> Location is already set!
              </div>
            )}

            {formData.selfie && (
              <div className="selfie-preview">
                <img src={formData.selfie} alt="Selfie preview" width="100"/>
                <span>Selfie has been captured!</span>
              </div>
            )}

            <button type="submit" className="register-btn">
              Register
            </button>

            <div className="login-links">
              <Link to='/auth/user/login'>Already have an account? Login</Link>
            </div>
          </div>
        </form>
      ) : showMap ? (
        <div className="map-popup">
          <div id="map-container" style={{ height: "400px", width: "100%" }}></div>
          <button 
            onClick={handleConfirmLocation} 
            className='map-popup-btn'
            disabled={!formData.latitude || !formData.longitude}
          >
            Confirm Location
          </button>
        </div>
      ) : (
        <div className="camera-popup">
          {!photoCaptured ? (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                style={{ 
                  width: '100%', 
                  maxHeight: '400px',
                  transform: cameraFacingMode === 'user' ? 'scaleX(-1)' : 'none'
                }} 
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              <div className="camera-controls">
                <button 
                  type="button" 
                  onClick={toggleCamera} 
                  className="camera-btn secondary"
                >
                  <i className="fas fa-sync-alt"></i> Open & Switch Camera
                </button>
                <button 
                  type="button" 
                  onClick={captureSelfie} 
                  className="camera-btn primary"
                >
                  <i className="fas fa-camera"></i> Take Photo
                </button>
                <button 
                  type="button" 
                  onClick={resetCameraProcess}
                  className="camera-btn cancel"
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="photo-preview">
                <img src={formData.selfie} alt="Captured preview" style={{ 
                  width: '100%',
                  maxHeight: '400px',
                  transform: cameraFacingMode === 'user' ? 'scaleX(-1)' : 'none'
                }} />
              </div>
              
              <div className="camera-controls">
                <button 
                  type="button" 
                  onClick={retakePhoto} 
                  className="camera-btn secondary"
                >
                  <i className="fas fa-redo"></i> Retake Photo
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    stopCamera();
                    setShowCamera(false);
                  }}
                  className="camera-btn primary"
                >
                  <i className="fas fa-check"></i> Use This Photo
                </button>
              </div>
            </>
          )}
          
          <div className="camera-instructions">
            <p>Please center your face in the frame</p>
            <p>Ensure good lighting and remove sunglasses</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRegister;