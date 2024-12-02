// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './context/AuthProvider';
import { BrowserRouter, HashRouter} from 'react-router-dom';
import { DarkModeProvider } from './DarkModeContext';
import './global.css'; // Ensure your global styles are imported

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <HashRouter>
      <AuthProvider
        authType="cookie"
        authName="_auth"
        cookieDomain={window.location.hostname}
        cookieSecure={window.location.protocol === "https:"}
      >
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);