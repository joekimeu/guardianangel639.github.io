// header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import useAuth from './hooks/useAuth';
import './header.css';

// ⬇️ add this import (adjust path if needed)
import gaLogo from '../src/logos/logo4.png';

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { auth, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/signin');
  };

  return (
    <header className={`header ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="container">
        <div className="header-content">
          {/* ⬇️ updated brand block */}
          {/* Brand (logo only) */}
            <Link to="/" className="brand" aria-label="Guardian Angel Health Agency Home">
                <div className="brand-logo-box">
                    {/* <img
                    src={gaLogo}
                    alt="Guardian Angel Health Agency logo"
                    className="brand-logo-img"
                    /> */}
                    Guardian Angel Health Agency
                </div>
            </Link>


          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/trainings">Trainings</Link>
            <Link to="/prospective">Prospective</Link>

            {auth?.user && (
              <>
                <Link to="/clockinout">Clock In/Out</Link>
                <Link to="/punchhistory">Punch History</Link>
                <Link to="/qrcode">QR Code</Link>
                {isAdmin() && (
                  <>
                    <Link to="/allusers">All Users</Link>
                    <Link to="/operatingcommitte">Operating Committee</Link>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="header-actions">
            <button
              onClick={toggleDarkMode}
              className="theme-toggle"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {auth?.user ? (
              <div className="user-menu">
                <span className="username">
                  Welcome, {auth.user.firstname}!
                  {isAdmin() && <span className="role-badge">Admin</span>}
                </span>
                <button onClick={handleSignOut} className="btn btn-outline">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/signin" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
