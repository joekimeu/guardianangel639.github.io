import React from 'react';
import { createRoot } from 'react-dom/client';
import {HashRouter}  from 'react-router-dom';

// Import CSS in specific order for proper cascading
import './theme.css';           // Theme variables and base styles
import './global.css';          // Global reset and base styles
import './components.css';      // Reusable component styles
import './layout.css';          // Layout and grid system
import './header.css';          // Header specific styles
import './footer.css';          // Footer specific styles
import './home.css';            // Home page styles
import './contact.css';         // Contact page styles
import './optimizations.css';   // Performance optimizations
import './App.css';             // App specific styles
import './index.css';           // Additional global styles

import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthProvider';

// Create root
const container = document.getElementById('root');
const root = createRoot(container);

// Render app
root.render(
  <React.StrictMode>
    <HashRouter /* basename="/" */>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);

// Initialize reveal animations
const initRevealAnimations = () => {
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// Initialize dark mode
const initDarkMode = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  document.body.className = savedTheme || (prefersDark ? 'dark-theme' : 'light-theme');
};

/*
this scrolling, functionality is transparent
*/

// Initialize smooth scroll
const initSmoothScroll = () => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }
};

// Remove preload screen
const removePreloader = () => {
  const preload = document.getElementById('preload');
  if (preload) {
    preload.classList.add('fade-out');
    setTimeout(() => {
      preload.style.display = 'none';
    }, 300);
  }
};

// Initialize everything when the page loads
window.addEventListener('load', () => {
  initDarkMode();
  initSmoothScroll();
  initRevealAnimations();
  removePreloader();
});

// Listen for color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    document.body.className = e.matches ? 'dark-theme' : 'light-theme';
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
