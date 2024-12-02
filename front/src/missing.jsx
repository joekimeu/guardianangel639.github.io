import { Link } from "react-router-dom"
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import { useContext } from 'react';

const Missing = () => {
    const { darkMode } = useContext(DarkModeContext);
    return (
        <article style={{ padding: "100px" }}>
            <h1>Oops!</h1>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link to="/">Visit Our Homepage</Link>
            </div>
        </article>
    )
}

export default Missing