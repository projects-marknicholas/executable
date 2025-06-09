import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

// Service Pages
import HomePage from "./service-pages/HomePage";
import QRScanner from "./service-pages/Scanner";
import Stream from "./service-pages/Stream";
import InAppBrowserDetector from "./browser-detection";

// User Auth
import UserLogin from "./pages/user/auth/login";
import UserRegister from "./pages/user/auth/register";
import UserForgotPassword from "./pages/user/auth/forgot-password";
import UserResetPassword from "./pages/user/auth/reset-password";
import Login from "./pages/user/auth/test";
import TestRegister from "./pages/user/auth/test-register";
import Logout from "./pages/user/auth/logout";

// User
import UserGetStarted from "./pages/user/home/get-started";
import UserHome from "./pages/user/home/home";
import UserCategory from "./pages/user/home/category";
import UserGender from "./pages/user/home/gender";
import UserSettings from "./pages/user/home/settings";

// CSS
import './assets/css/default.css';
import './assets/css/colors.css';

const App = () => {
  return (
    <main>
      <BrowserRouter>
        <InAppBrowserDetector/>
        <Routes>
          {/* User Auth */}
          <Route path="/" element={<UserLogin />}/>
          <Route path="/auth/user/login" element={<UserLogin />}/>
          <Route path="/auth/user/register" element={<UserRegister />}/>
          <Route path="/auth/user/forgot-password" element={<UserForgotPassword />}/>
          <Route path="/auth/user/reset-password" element={<UserResetPassword />}/>
          {/* <Route path="/test" element={<TestRegister />}/> */}
          <Route path="/auth/logout" element={<Logout />}/>

          {/* User */}
          <Route path="/user/get-started" element={<UserGetStarted />}/>
          <Route path="/user" element={<UserHome />}/>
          <Route path="/category" element={<UserCategory />}/>
          <Route path="/gender" element={<UserGender />}/>
          <Route path="/settings" element={<UserSettings />}/>
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default App;
