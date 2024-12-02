import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DarkModeContext } from './DarkModeContext';
import './global.css';

export default function Create() {
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const { darkMode } = useContext(DarkModeContext);

    const handleConfirmedPassword = (e) => {
        setConfirmedPassword(e.target.value);
    };

    const [values, setValues] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        position: ''
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if passwords match
        if (values.password !== confirmedPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        // Confirm the action
        if (!window.confirm('Are you sure you want to create this user?')) {
            return;
        }

        axios.post('https://gaha-website-c6534f8cf004.herokuapp.com/employees', values)
            .then(res => {
                console.log(res);
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <div className={`d-flex min-vh-100 justify-content-center align-items-center ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div className={`w-50 rounded shadow-lg p-5 ${darkMode ? 'bg-dark border border-light' : 'bg-white'}`}>
                <form onSubmit={handleSubmit}>
                    <h2 className='text-center mb-4'>Add Employee</h2>
                    <div className='mb-3'>
                        <label htmlFor="username" className='form-label'>Username</label>
                        <input type="text" name="username" className="form-control" id="username" onChange={handleChange} required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" className='form-label'>Password</label>
                        <input type="password" name="password" className="form-control" id="password" onChange={handleChange} required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="confirmPassword" className='form-label'>Confirm Password</label>
                        <input type="password" name="confirmPassword" className="form-control" id="confirmPassword" onChange={handleConfirmedPassword} required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email" className='form-label'>Email</label>
                        <input type="email" name="email" className="form-control" id="email" onChange={handleChange} required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="firstname" className='form-label'>First Name</label>
                        <input type="text" name="firstname" className="form-control" id="firstname" onChange={handleChange} required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="lastname" className='form-label'>Last Name</label>
                        <input type="text" name="lastname" className="form-control" id="lastname" onChange={handleChange} required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="position" className='form-label'>Position</label>
                        <input type="text" name="position" className="form-control" id="position" onChange={handleChange} required />
                    </div>
                    <button type="submit" className='btn btn-success w-100 mt-3'>Submit</button>
                </form>
            </div>
        </div>
    );
}
