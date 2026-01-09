import { useContext } from 'react';
import DarkModeContext from '../context/DarkModeContext';

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    
    const { darkMode, setDarkMode, toggleDarkMode } = context;
    
    return {
        darkMode,
        setDarkMode,
        toggleDarkMode,
        // Helper functions
        isDark: darkMode,
        isLight: !darkMode,
        // Theme class helper
        themeClass: darkMode ? 'dark-theme' : 'light-theme',
        // Theme colors
        colors: {
            background: darkMode ? 'var(--bg-dark)' : 'var(--bg-light)',
            text: darkMode ? 'var(--text-dark)' : 'var(--text-light)',
            primary: 'var(--primary-600)',
            secondary: darkMode ? 'var(--surface-2-dark)' : 'var(--surface-2-light)',
        }
    };
};

export default useDarkMode;
