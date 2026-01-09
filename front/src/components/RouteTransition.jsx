import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../animations.css';

const RouteTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Add route-change class to force immediate visibility
    document.body.classList.add('route-change');

    // Initialize reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
      // Ensure element is visible immediately
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      
      // Setup animation classes
      el.classList.remove('active');
      requestAnimationFrame(() => {
        el.classList.add('active');
      });
    });

    // Remove route-change class after animations are complete
    const timeout = setTimeout(() => {
      document.body.classList.remove('route-change');
    }, 300); // Increased timeout to ensure elements are visible

    return () => clearTimeout(timeout);
  }, [location.pathname]); // Re-run when route changes

  return <>{children}</>;
};

export default RouteTransition;
