import { useEffect } from 'react';

const AnimationController = () => {
  useEffect(() => {
    // Add styles to head
    const style = document.createElement('style');
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        will-change: opacity, transform;
      }
      
      .reveal.active {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .reveal {
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Only run once on mount

  return null;
};

export default AnimationController;
