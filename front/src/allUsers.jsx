import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DarkModeContext } from './DarkModeContext';
import './global.css';

export default function AllUsers() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { darkMode } = useContext(DarkModeContext);

    useEffect(() => {
        axios.get('https://gaha-website-c6534f8cf004.herokuapp.com/home')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = (username) => {
        axios.delete('https://gaha-website-c6534f8cf004.herokuapp.com/delete/' + username)
            .then(res => {
                setData(data.filter(employee => employee.username !== username));
            })
            .catch(err => console.log(err));
    };

    const output = () => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error fetching data: {error.message}</div>;

        return Array.isArray(data) && data.length > 0 ? (
            data.map((employee, index) => (
                <tr key={index}>
                    <td>{employee.username}</td>
                    <td>{employee.email}</td>
                    <td>{employee.firstname}</td>
                    <td>{employee.lastname}</td>
                    <td>{employee.position}</td>
                    <td>
                        <Link to={'#/read/' + employee.username} className="btn btn-info btn-sm me-2">Read</Link>
                        <Link to={'#/edit/' + employee.username} className="btn btn-primary btn-sm me-2">Edit</Link>
                        <Link to={'#/clockinout/' + employee.username} className="btn btn-secondary btn-sm me-2">Punchcard</Link>
                        <button onClick={() => handleDelete(employee.username)} className="btn btn-danger btn-sm">Delete</button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="6" className="text-center">No data available</td>
            </tr>
        );
    };

    return (
        <div className={`d-flex flex-column min-vh-100 ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'} p-5`}>
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '2rem' }}>
                <h2>Employee List</h2>
                <Link to="#/create" className="btn btn-success btn-lg">Create +</Link>
            </div>
            <div className={`table-responsive rounded shadow-lg p-4 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`}>
                <table className={`table ${darkMode ? 'table-dark' : 'table-light'} table-hover table-bordered`}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Position</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {output()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
