import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './home';
import About from './about';
import Contact from './contact';
import Trainings from './trainings';
import Prospective from './prospective';
import SignIn from './signIn';
import Missing from './missing';
import Unauthorized from './unauthorized';
import RequireAuth from './RequireAuth';
import OperatingCommitte from './operatingCommitte';
import ClockInOut from './clockinout';
import PunchHistory from './punchHistory';
import QRCodeDisplay from './qrCodeDisplay';
import AllUsers from './allUsers';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider } from './context/AuthProvider';
import './App.css';

// Define role-based route access
const ROLES = {
  User: 'User',
  Admin: 'Admin'
};

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="prospective" element={<Prospective />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="unauthorized" element={<Unauthorized />} />

            {/* Protected Routes - Users & Admins */}
            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
              <Route path="trainings" element={<Trainings />} />
              <Route path="clockinout" element={<ClockInOut />} />
              <Route path="punchhistory" element={<PunchHistory />} />
              <Route path="qrcode" element={<QRCodeDisplay />} />
            </Route>

            {/* Protected Routes - Admin Only */}
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="allusers" element={<AllUsers />} />
              <Route path="operatingcommitte" element={<OperatingCommitte />} />
            </Route>

            {/* Catch All */}
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
