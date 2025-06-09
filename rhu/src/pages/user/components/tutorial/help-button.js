// components/TutorialGuide/HelpButton.js
import React from 'react';

const HelpButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="help-button"
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      background: '#0339A8',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      fontSize: '20px',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    }}
  >
    ?
  </button>
);

export default HelpButton;