import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { clockInOut, handleApiError } from './services/api';
import './clockinout.css';

const ClockInOut = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Fetch current status on mount and every 5 minutes
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const currentStatus = await clockInOut.getCurrentStatus();
                setStatus(currentStatus);
            } catch (err) {
                const errorDetails = handleApiError(err);
                setError(errorDetails.message);
            }
        };

        fetchStatus();
        const statusInterval = setInterval(fetchStatus, 5 * 60 * 1000);

        return () => clearInterval(statusInterval);
    }, []);

    const handleAction = async (action) => {
        setLoading(true);
        setError(null);

        try {
            let response;
            switch (action) {
                case 'clockIn':
                    response = await clockInOut.clockIn();
                    break;
                case 'clockOut':
                    response = await clockInOut.clockOut();
                    break;
                case 'startLunch':
                    response = await clockInOut.startLunch();
                    break;
                case 'endLunch':
                    response = await clockInOut.endLunch();
                    break;
                default:
                    throw new Error('Invalid action');
            }

            // Update status after successful action
            setStatus(await clockInOut.getCurrentStatus());
            
            // Show success message (could be enhanced with a toast notification)
            console.log(response.message);
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (value) => {
        if (!value) return 'N/A';

        // If backend ever returns a full ISO datetime, Date can handle it:
        const asDate = new Date(value);
        if (!Number.isNaN(asDate.getTime())) {
            return asDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }

        // Handle Postgres TIME like "HH:MM:SS"
        if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?/.test(value)) {
            const [hh, mm] = value.split(':');
            const hour = parseInt(hh, 10);
            const minute = parseInt(mm, 10);

            const d = new Date();
            d.setHours(hour, minute, 0, 0);
            return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }

        return 'N/A';
        };


    const getStatusDisplay = () => {
        if (!status) return 'Not Clocked In';
        if (status.clockout_time) return 'Clocked Out';
        if (status.lunch_start && !status.lunch_end) return 'On Lunch Break';
        return 'Clocked In';
    };

    const getAvailableActions = () => {
        if (!status || status.clockout_time) {
            return ['clockIn'];
        }
        if (status.lunch_start && !status.lunch_end) {
            return ['endLunch'];
        }
        if (!status.lunch_start) {
            return ['startLunch', 'clockOut'];
        }
        return ['clockOut'];
    };

    const actionLabels = {
        clockIn: 'Clock In',
        clockOut: 'Clock Out',
        startLunch: 'Start Lunch',
        endLunch: 'End Lunch'
    };

    return (
        <div className="clock-in-out">
            <div className="clock-container">
                <h1>Time Clock</h1>
                
                <div className="current-time">
                    {currentTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })}
                </div>

                <div className="user-info">
                    <h2>Welcome, {auth.user.firstname} {auth.user.lastname}</h2>
                    <p className="status">Current Status: {getStatusDisplay()}</p>
                </div>

                {error && (
                    <div className="alert alert-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="action-buttons">
                    {getAvailableActions().map(action => (
                        <button
                            key={action}
                            onClick={() => handleAction(action)}
                            className={`btn btn-${action === 'clockIn' ? 'primary' : 'secondary'}`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : actionLabels[action]}
                        </button>
                    ))}
                </div>

                {status && (
                    <div className="status-details">
                        <h3>Today's Activity</h3>
                        <div className="status-grid">
                            {status.clockin_time && (
                                <div className="status-item">
                                    <span>Clock In:</span>
                                    <span>{formatTime(status.clockin_time)}</span>
                                </div>
                            )}
                            {status.lunch_start && (
                                <div className="status-item">
                                    <span>Lunch Start:</span>
                                    <span>{formatTime(status.lunch_start)}</span>
                                </div>
                            )}
                            {status.lunch_end && (
                                <div className="status-item">
                                    <span>Lunch End:</span>
                                    <span>{formatTime(status.lunch_end)}</span>
                                </div>
                            )}
                            {status.clockout_time && (
                                <div className="status-item">
                                    <span>Clock Out:</span>
                                    <span>{formatTime(status.clockout_time)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/punchhistory')}
                    className="btn btn-link"
                >
                    View Punch History
                </button>
            </div>
        </div>
    );
};

export default ClockInOut;
