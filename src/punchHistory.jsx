import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthProvider';
import { useParams, Link } from 'react-router-dom';
import { DarkModeContext } from './DarkModeContext';
import './global.css';

const PunchHistory = () => {
    const { username } = useParams();
    const { auth } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { darkMode } = useContext(DarkModeContext);
    
    const fetchHistory = async () => {
        try {
            const res = await axios.get('https://gaha-website-c6534f8cf004.herokuapp.com/clockhistory/' + username, {
                headers: { Authorization: auth.token }
            });
            setHistory(res.data);
        } catch (err) {
            setError("Failed to fetch history: " + (err.response?.data?.error || err.message));
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const calculateDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        const startTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);
        const duration = (endTime - startTime) / 1000 / 60; // duration in minutes
        const hours = Math.floor(duration / 60);
        const minutes = Math.round(duration % 60);
        return `${hours}h ${minutes}m`;
    };


    return  (
        <div className="container mt-5">
                        <h3 className="mt-5">History</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Lunch Start</th>
                        <th>Lunch End</th>
                        <th>Clock Out</th>
                        <th>Work Duration</th>
                        <th>Lunch Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.date}</td>
                            <td>{entry.clockin_time}</td>
                            <td>{entry.lunch_start || 'N/A'}</td>
                            <td>{entry.lunch_end || 'N/A'}</td>
                            <td>{entry.clockout_time || 'N/A'}</td>
                            <td>
                                {calculateDuration(
                                    entry.clockin_time,
                                    entry.clockout_time
                                )}
                            </td>
                            <td>
                                {calculateDuration(
                                    entry.lunch_start,
                                    entry.lunch_end
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='d-flex justify-content-between mt-3'>
                    <Link to="/home" className='btn btn-info'>Back</Link>
                </div>
        </div>
    )

}

export default PunchHistory;