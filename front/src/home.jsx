import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './global.css';

export default function Home() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employees from server
    useEffect(() => {
        axios.get('https://gaha-website-c6534f8cf004.herokuapp.com/home')
            .then(res => {
                console.log('Data fetched:', res.data);
                setData(res.data);  
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching data:', err);
                setError(err);
                setLoading(false);
            });
    }, []);

    // Delete an employee with button push
    const handleDelete = (username) => {
        axios.delete('https://gaha-website-002d2aeac73a.herokuapp.com/delete/' + username)
            .then(res => {
                setData(data.filter(employee => employee.username !== username));
            })
            .catch(err => console.log(err));
    };

    // Gracefully handle program failure by displaying information inside formatted code
    function output() {
        if (loading) {
            return (
                <tr>
                    <td colSpan="7" className="text-center">Loading...</td>
                </tr>
            );
        }
    
        if (error) {
            return (
                <tr>
                    <td colSpan="7" className="text-center text-danger">Error fetching data: {error.message}</td>
                </tr>
            );
        }

        return Array.isArray(data) && data.length > 0 ? (
            data.map((employee, index) => (
                <tr key={index}>
                    <td>{employee.username}</td>
                    <td>{employee.email}</td>
                    <td>{employee.firstname}</td>
                    <td>{employee.lastname}</td>
                    <td>{employee.position}</td>
                    <td>
                        <Link to={'#/read/' + employee.username} className='btn btn-sm btn-info me-2'>Read</Link>
                        <Link to={'#/edit/' + employee.username} className='btn btn-sm btn-primary me-2'>Edit</Link>
                        <Link to={'#/punchhistory/' + employee.username} className='btn btn-sm btn-secondary me-2'>Punchcard</Link>
                        <button onClick={() => handleDelete(employee.username)} className='btn btn-sm btn-danger'>Delete</button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7" className="text-center">No data available</td>
            </tr>
        );
    }

    return (
        <div className='container mt-5'>
            <h2 className='mb-4'>Employee List</h2>
            <div className='d-flex justify-content-end mb-3'>
                <Link to="#/create" className="btn btn-success">Create +</Link>
            </div>
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead className='table-dark'>
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