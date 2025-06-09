import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import
import App from './App';

// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import reportWebVitals from './reportWebVitals';

import './index.css';

// Create a root and render the app
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// serviceWorkerRegistration.register();
// reportWebVitals();