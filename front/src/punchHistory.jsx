import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { clockInOut, handleApiError } from './services/api';
import './punchHistory.css';

const PunchHistory = () => {
    const { auth } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dateFilter, setDateFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const itemsPerPage = 10;

    useEffect(() => {
        fetchHistory();
    }, [page, dateFilter, sortOrder]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await clockInOut.getHistory(
                auth.user.username,
                page,
                itemsPerPage
            );

            let filteredData = response;
            
            // Apply date filter if set
            if (dateFilter) {
                filteredData = filteredData.filter(entry => 
                    entry.date.startsWith(dateFilter)
                );
            }

            // Apply sorting
            filteredData.sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.clockin_time}`);
                const dateB = new Date(`${b.date} ${b.clockin_time}`);
                return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
            });

            setHistory(filteredData);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (date, time) => {
        if (!date || !time) return 'N/A';
        return new Date(`${date} ${time}`).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        
        const startTime = new Date(`2000-01-01 ${start}`);
        const endTime = new Date(`2000-01-01 ${end}`);
        const diff = endTime - startTime;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    };

    const calculateLunchDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        return calculateDuration(start, end);
    };

    const calculateTotalHours = (entry) => {
        if (!entry.clockin_time || !entry.clockout_time) return 'N/A';
        
        let totalMinutes = 0;
        const clockInTime = new Date(`2000-01-01 ${entry.clockin_time}`);
        const clockOutTime = new Date(`2000-01-01 ${entry.clockout_time}`);
        
        totalMinutes = (clockOutTime - clockInTime) / (1000 * 60);
        
        if (entry.lunch_start && entry.lunch_end) {
            const lunchStart = new Date(`2000-01-01 ${entry.lunch_start}`);
            const lunchEnd = new Date(`2000-01-01 ${entry.lunch_end}`);
            const lunchDuration = (lunchEnd - lunchStart) / (1000 * 60);
            totalMinutes -= lunchDuration;
        }
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="punch-history">
            <h1>Punch History</h1>
            
            <div className="filters">
                <div className="filter-group">
                    <label htmlFor="dateFilter">Filter by Date:</label>
                    <input
                        type="date"
                        id="dateFilter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="sortOrder">Sort Order:</label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading">Loading punch history...</div>
            ) : (
                <>
                    <div className="history-table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Clock In</th>
                                    <th>Lunch Start</th>
                                    <th>Lunch End</th>
                                    <th>Clock Out</th>
                                    <th>Lunch Duration</th>
                                    <th>Total Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                                        <td>{formatDateTime(entry.date, entry.clockin_time)}</td>
                                        <td>{formatDateTime(entry.date, entry.lunch_start)}</td>
                                        <td>{formatDateTime(entry.date, entry.lunch_end)}</td>
                                        <td>{formatDateTime(entry.date, entry.clockout_time)}</td>
                                        <td>{calculateLunchDuration(entry.lunch_start, entry.lunch_end)}</td>
                                        <td>{calculateTotalHours(entry)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="btn btn-secondary"
                        >
                            Previous
                        </button>
                        <span className="page-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="btn btn-secondary"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PunchHistory;
