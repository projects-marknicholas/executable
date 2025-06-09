// React
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// CSS
import './assets/css/default.css';
import './assets/css/colors.css';

// Auth
import Login from './auth/login';
import Register from './auth/register';
import ForgotPassword from './auth/forgot-password';
import ResetPassword from './auth/reset-password';

// Pages
import Dashboard from './pages/dashboard';
import Reports from './pages/reports';
import Problem from './pages/problem';
import Accounts from './pages/accounts';
import AccountSettings from './pages/account-settings';
import Registrations from './pages/registrations';
import Symptoms from './pages/symptoms';
import OldSymptomsData from './pages/old-symptoms';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          {/* Pages */}
          <Route path="/admin/" element={<Dashboard />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/problem" element={<Problem />} />
          <Route path="/admin/accounts" element={<Accounts />} />
          <Route path="/admin/account-settings" element={<AccountSettings />} />
          <Route path="/admin/registrations" element={<Registrations />} />
          <Route path="/admin/symptoms" element={<Symptoms />} />
          <Route path="/admin/old-symptoms" element={<OldSymptomsData />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;