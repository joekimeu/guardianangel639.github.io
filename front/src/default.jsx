import { useNavigate } from "react-router-dom"
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import { useContext } from 'react';

export default function Default() {
    const navigate = useNavigate()
    const { darkMode } = useContext(DarkModeContext);

    return (
        <>
            <article style={{ padding: "100px" }}>
                <h1>Default Page</h1>
                <p>default page</p>
                <div>cool brand information</div>
                <div>nice pictures</div>
                <button onClick={() => navigate("#/signin")}>
                 Sign In
                </button>
            </article>
        </>
    )
}