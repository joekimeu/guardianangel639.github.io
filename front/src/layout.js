import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import { useDarkMode } from './hooks/useDarkMode';
import './layout.css';

const Layout = () => {
    const { darkMode } = useDarkMode();

    return (
        <div className={`layout ${darkMode ? 'dark-theme' : 'light-theme'}`}>
            <a href="#main" className="skip-to-main">
                Skip to main content
            </a>
            
            <Header />
            
            <main id="main" className="main">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
};

export default Layout;
