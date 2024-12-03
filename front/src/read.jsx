import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { DarkModeContext } from './DarkModeContext';
import './global.css';

export default function Read() {
    const { username } = useParams();
    const [employee, setEmployee] = useState({});
    const { darkMode } = useContext(DarkModeContext);

    useEffect(() => {
        axios.get('https://gaha-website-c6534f8cf004.herokuapp.com/read/' + username)
            .then(res => {
                setEmployee(res.data);
                console.log(res);
            })
            .catch(err => console.log(err));
    }, [username]);

    return (
        <div
            className={`d-flex vh-100 justify-content-center align-items-center ${
                darkMode ? 'bg-dark text-white' : 'bg-light text-dark'
            }`}
        >
            <div
                className={`w-auto rounded p-4 shadow ${
                    darkMode ? 'card-dark' : 'card-light'
                }`}
            >
                <h2 className='mb-4'>{employee.firstname}'s Information</h2>
                <table className={`table ${darkMode ? 'table-dark' : 'table-light'}`}>
                    <tbody>
                        <tr>
                            <th>Username:</th>
                            <td>{employee.username}</td>
                        </tr>
                        <tr>
                            <th>Password:</th>
                            <td>{employee.password}</td>
                        </tr>
                        <tr>
                            <th>Email:</th>
                            <td>{employee.email}</td>
                        </tr>
                        <tr>
                            <th>First Name:</th>
                            <td>{employee.firstname}</td>
                        </tr>
                        <tr>
                            <th>Last Name:</th>
                            <td>{employee.lastname}</td>
                        </tr>
                        <tr>
                            <th>Position:</th>
                            <td>{employee.position}</td>
                        </tr>
                    </tbody>
                </table>
                <div className='d-flex justify-content-between mt-3'>
                    <Link to="#/home" className={`btn btn-${darkMode ? 'light' : 'info'}`}>
                        Back
                    </Link>
                    <Link
                        to={`#/edit/${employee.username}`}
                        className={`btn btn-${darkMode ? 'secondary' : 'primary'}`}
                    >
                        Edit
                    </Link>
                </div>
            </div>
        </div>
    );
}
