import { useEffect, useRef } from 'react';

const useMountEffect = () => {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      // Set up reveal animations
      const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Force a re-render by removing and re-adding the class
            entry.target.classList.remove('reveal');
            void entry.target.offsetWidth; // Trigger reflow
            entry.target.classList.add('reveal');
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Force all reveal elements to re-render
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('reveal');
        void el.offsetWidth; // Trigger reflow
        el.classList.add('reveal');
        observer.observe(el);
      });

      mounted.current = true;
    }

    return () => {
      if (mounted.current) {
        mounted.current = false;
      }
    };
  }, []);
};

export default useMountEffect;
