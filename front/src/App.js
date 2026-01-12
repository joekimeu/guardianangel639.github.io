// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './layout';
import Home from './home';
import About from './about';
import Contact from './contact';
import Prospective from './prospective';
import SignIn from './signIn';
import Unauthorized from './unauthorized';
import Missing from './missing';


import Trainings from './trainings';
import ClockInOut from './clockinout';
import PunchHistory from './punchHistory';
import QRCodeDisplay from './qrCodeDisplay';
import AllUsers from './allUsers';
import OperatingCommitte from './operatingCommitte';
import Create from './create'
import Edit from './edit'
import SearchResults from './searchResults'
import Read from './read'

import RequireAuth from './RequireAuth';
import { DarkModeProvider } from './context/DarkModeContext';

function App() {
  return (
    <DarkModeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="prospective" element={<Prospective />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Protected: Trainings */}
          <Route element={<RequireAuth requiredPermission="default_trainings" />}>
            <Route path="trainings" element={<Trainings />} />
          </Route>

           {/* Protected: Clock + own records */}
          <Route element={<RequireAuth requiredPermission="approve_time" />}>
            <Route path="clockinout" element={<ClockInOut />} />
             <Route path="punchhistory/:username" element={<PunchHistory />} />
          </Route>

          {/* Protected: Admin/system */}
          <Route element={<RequireAuth requiredPermission="manage_system" />}>
            <Route path="allusers" element={<AllUsers />} />
            <Route path="operatingcommitte" element={<OperatingCommitte />} />
            <Route path="edit/:username" element={<Edit />} />
            <Route path="read/:username" element={<Read />} />
            <Route path="create" element={<Create />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </DarkModeProvider>
  );
}

export default App;
