import React, { useEffect, useRef } from 'react';

const withMountEffects = (WrappedComponent) => {
  return function WithMountEffectsComponent(props) {
    const mounted = useRef(false);

    useEffect(() => {
      if (!mounted.current) {
        // Force all reveal elements to re-render on mount
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => {
          // Remove and re-add reveal class to trigger animation
          el.classList.remove('reveal');
          void el.offsetWidth; // Trigger reflow
          el.classList.add('reveal');
          el.classList.add('active');
        });
        
        mounted.current = true;
      }

      return () => {
        mounted.current = false;
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withMountEffects;
