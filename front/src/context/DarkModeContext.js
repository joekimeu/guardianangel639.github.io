import React, { createContext, useState, useEffect } from 'react';

export const DarkModeContext = createContext({
    darkMode: false,
    setDarkMode: () => {},
});

export const DarkModeProvider = ({ children }) => {
    // Initialize state from localStorage or system preference
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Update localStorage and document class when theme changes
    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark-theme', darkMode);
        
        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', darkMode ? '#0f172a' : '#0ea5e9');
        }
    }, [darkMode]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            // Only update if user hasn't manually set a theme
            if (!localStorage.getItem('theme')) {
                setDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Update theme when visibility changes (e.g., tab focus)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                document.documentElement.classList.toggle('dark-theme', darkMode);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const value = {
        darkMode,
        setDarkMode,
        toggleDarkMode
    };

    return (
        <DarkModeContext.Provider value={value}>
            {children}
        </DarkModeContext.Provider>
    );
};

export default DarkModeContext;
