// header.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDarkMode } from './hooks/useDarkMode';
import useAuth from './hooks/useAuth';
import './header.css';

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { auth, signOut, can } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
    navigate('/signin');
  };

  // Close menu on route change
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
      { to: '/prospective', label: 'Prospective' },
    ];

    if (!auth?.user) return base;

    const protectedLinks = [
      { to: '/clockinout', label: 'Clock In/Out', perm: 'approve_time' },
      { to: `/punchhistory/${auth.user.username}`, label: 'Punch History', perm: 'approve_time' },
      { to: '/trainings', label: 'Trainings', perm: 'default_trainings' },
      { to: '/allusers', label: 'All Users', perm: 'manage_system' },
      { to: '/operatingcommitte', label: 'Operating Committee', perm: 'manage_system' },
    ];

    return [
      ...base,
      ...protectedLinks.filter((l) => !l.perm || can(l.perm)),
    ];
  }, [auth?.user, can]);

  return (
    <header className={`header ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="container">
        <div className="header-content">
          {/* Brand */}
          <Link to="/" className="brand" aria-label="Guardian Angel Health Agency Home">
            <div className="brand-logo-box">Guardian Angel Health Agency</div>
          </Link>

          {/* Right-side actions */}
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
                <span className="username">Welcome, {auth.user.firstname}!</span>
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

      {/* Full-page overlay */}
      <div
        id="mobile-menu-overlay"
        className={`menu-overlay ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onMouseDown={(e) => {
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
              <button onClick={handleSignOut} className="btn btn-outline menu-signout">
                Sign Out
              </button>
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
