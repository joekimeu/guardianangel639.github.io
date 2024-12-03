import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import './edit.css';

export default function Edit() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { darkMode } = useContext(DarkModeContext);

    const [values, setValues] = useState({
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        position: ''
    });

    useEffect(() => {
        axios.get(`https://gaha-website-c6534f8cf004.herokuapp.com/read/${username}`)
            .then(res => {
                if (res.data) {
                    const userData = res.data;
                    setValues({
                        username: userData.username,
                        password: userData.password,
                        email: userData.email,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        position: userData.position
                    });
                }
            })
            .catch(err => console.log(err));
    }, [username]);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleUpdate = (event) => {
        event.preventDefault();
        axios.put(`https://gaha-website-002d2aeac73a.herokuapp.com/edit/${username}`, values)
            .then(res => {
                navigate('#/home');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className={`edit-page d-flex vh-100 justify-content-center align-items-center ${darkMode ? 'bg-dark' : 'bg-light'}`}>
            <div className={`edit-card rounded p-4 shadow-lg ${darkMode ? 'card-dark' : 'card-light'}`}>
                <form onSubmit={handleUpdate}>
                    <h2 className="text-center mb-4" style={{ color: darkMode ? '#ffffff' : '#007bff' }}>
                        Update Employee Information
                    </h2>
                    {['username', 'password', 'email', 'firstname', 'lastname', 'position'].map((field, index) => (
                        <div className="mb-3" key={index}>
                            <label htmlFor={field} className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input 
                                type={field === 'email' ? 'email' : 'text'} 
                                name={field} 
                                className="form-control" 
                                id={field} 
                                value={values[field]} 
                                onChange={handleChange} 
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn btn-success w-100 mt-3">Update</button>
                </form>
            </div>
        </div>
    );
}
