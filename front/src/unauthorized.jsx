import { useNavigate } from "react-router-dom";
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import { useContext } from 'react';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { darkMode } = useContext(DarkModeContext); // Access dark mode state
    const goBack = () => navigate(-1);

    return (
        <section className={`min-vh-100 d-flex flex-column align-items-center justify-content-center ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <h1>Unauthorized</h1>
            <p>You do not have access to the requested page.</p>
            <button className={`btn btn-${darkMode ? 'light' : 'dark'}`} onClick={goBack}>
                Go Back
            </button>
        </section>
    );
};

export default Unauthorized;
