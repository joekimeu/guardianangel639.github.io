// header.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import useAuth from './hooks/useAuth';
import './header.css';

// Optional logo import (leave if you actually use it)
// import gaLogo from '../src/logos/logo4.png';

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { auth, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    // preserve existing behavior
    signOut();
    setMenuOpen(false);
    navigate('/signin');
  };

  // Close menu on route change (covers clicking Links + programmatic navs)
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ESC to close + body scroll lock
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const links = useMemo(() => {
    const base = [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/trainings', label: 'Trainings' },
      { to: '/prospective', label: 'Prospective' },
    ];

    if (!auth?.user) return base;

    const authed = [
      { to: '/clockinout', label: 'Clock In/Out' },
      { to: '/punchhistory', label: 'Punch History' },
      { to: '/qrcode', label: 'QR Code' },
    ];

    const admin = isAdmin()
      ? [
          { to: '/allusers', label: 'All Users' },
          { to: '/operatingcommitte', label: 'Operating Committee' },
        ]
      : [];

    return [...base, ...authed, ...admin];
  }, [auth?.user, isAdmin]);

  return (
    <header className={`header ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="container">
        <div className="header-content">
          {/* Brand */}
          <Link to="/" className="brand" aria-label="Guardian Angel Health Agency Home">
            <div className="brand-logo-box">
              {/* Example if using image:
              <img src={gaLogo} alt="Guardian Angel Health Agency logo" className="brand-logo-img" />
              */}
              Guardian Angel Health Agency
            </div>
          </Link>

          {/* Right-side actions stay visible (theme + auth + hamburger) */}
          <div className="header-actions">
            <button
              onClick={toggleDarkMode}
              className="theme-toggle"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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

            {/* Hamburger */}
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu-overlay"
              type="button"
            >
              <span className={`hamburger-lines ${menuOpen ? 'is-open' : ''}`} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-page overlay menu */}
      <div
        id="mobile-menu-overlay"
        className={`menu-overlay ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onMouseDown={(e) => {
          // click outside panel closes
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <div className="menu-panel">
          <div className="menu-header">
            <div className="menu-title">Menu</div>
            <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              ✕
            </button>
          </div>

          <nav className="menu-links" aria-label="Primary navigation">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="menu-link">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="menu-footer">
            {auth?.user ? (
              <>
                <div className="menu-welcome">
                  Welcome, {auth.user.firstname}! {isAdmin() ? <span className="role-badge">Admin</span> : null}
                </div>
                <button onClick={handleSignOut} className="btn btn-outline menu-signout">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/signin" className="btn btn-primary menu-signin">
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
