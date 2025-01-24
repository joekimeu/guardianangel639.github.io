import './App.css';
import { Routes, Route } from 'react-router-dom';
import Create from './create';
import AllUsers from './allUsers'
import 'bootstrap/dist/css/bootstrap.min.css';
import Read from './read';
import Edit from './edit';
import SignIn from './signIn';
import ClockInOut from './clockinout';
import Missing from './missing';
import Unauthorized from './unauthorized';
import Layout from './layout';
import SearchResults from './searchResults';
import { AuthContext } from './context/AuthProvider';
import PunchHistory from './punchHistory';
import {jwtDecode} from 'jwt-decode';
import About from './about';
import OperatingCommittee from './operatingCommitte';
import Trainings from './trainings';
import Prospective from './prospective';
import Contact from './contact';
import QRCodeDisplay from './qrCodeDisplay';
import React, { useContext, useEffect } from 'react';
import { DarkModeContext } from './DarkModeContext';
import './global.css';

export default function App() {
  const { auth } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext); // Access dark mode state
  let employeeUsername = null;

  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      employeeUsername = decodedToken.username;
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
  }

  // Apply the dark-mode class to the body element based on darkMode state
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <Routes>
      <Route element={<Layout />}>
        {auth.token ? (
          employeeUsername === "annemulama" ? (
            <>
              <Route path="/" element={<About />} />
              <Route path="/create" element={<Create />} />
              <Route path="/punchhistory/:username" element={<PunchHistory />} />
              <Route path="/read/:username" element={<Read />} />
              <Route path="/edit/:username" element={<Edit />} />
              <Route path="/clockinout" element={<ClockInOut />} />
              <Route path="/clockinout/:username" element={<ClockInOut />} />
              <Route path="/totp/display" element={<QRCodeDisplay />} />
              <Route path="/trainings" element={<Trainings />} />
              <Route path="/allUsers" element={<AllUsers />} />
            </>
          ) : employeeUsername === "gahaemployee" ? (
            <>
              <Route path="/totp/display" element={<QRCodeDisplay />} />
              <Route path="/trainings" element={<Trainings />} />
            </>
          ) : (
            <>
              <Route path="/read/:username" element={<Read />} />
              <Route path="/edit/:username" element={<Edit />} />
              <Route path="/clockinout" element={<ClockInOut />} />
              <Route path="/totp/display" element={<QRCodeDisplay />} />
              <Route path="/trainings" element={<Trainings />} />
            </>
          )
        ) : (
          <Route path="*" element={<Unauthorized />} />
        )}

        {/* Public routes */}
        <Route exact path="/" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Missing />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/operatingcommittee" element={<OperatingCommittee />} />
        <Route path="/prospective" element={<Prospective />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
