import { useEffect } from 'react';

const useRevealAnimations = () => {
  useEffect(() => {
    // Only setup observer if we're not in a route change
    if (!document.body.classList.contains('route-change')) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });

      // Only observe elements that aren't already active
      document.querySelectorAll('.reveal:not(.active)').forEach(el => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, []); // Only run once on mount
};

export default useRevealAnimations;
