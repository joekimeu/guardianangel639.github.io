import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../services/api';

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIMEOUT = 29 * 60 * 1000; // 29 minutes
const CHECK_INTERVAL = 1000; // Check every second

const ActivityMonitor = ({ children }) => {
    const navigate = useNavigate();
    const { auth: authContext, setAuth } = useAuth();
    const lastActivity = useRef(Date.now());
    const warningShown = useRef(false);
    const warningTimer = useRef(null);
    const logoutTimer = useRef(null);

    const resetTimers = () => {
        lastActivity.current = Date.now();
        warningShown.current = false;

        if (warningTimer.current) {
            clearTimeout(warningTimer.current);
        }
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
        }

        // Set new timers
        warningTimer.current = setTimeout(showWarning, WARNING_TIMEOUT);
        logoutTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT);
    };

    const showWarning = () => {
        if (!warningShown.current && authContext?.token) {
            warningShown.current = true;
            
            // Show warning modal
            const remainingTime = Math.ceil((IDLE_TIMEOUT - WARNING_TIMEOUT) / 1000 / 60);
            
            const modal = document.createElement('div');
            modal.className = 'idle-warning-modal';
            modal.innerHTML = `
                <div class="idle-warning-content">
                    <h2>Session Timeout Warning</h2>
                    <p>Your session will expire in ${remainingTime} minute${remainingTime > 1 ? 's' : ''}.</p>
                    <p>Click anywhere or move your mouse to stay signed in.</p>
                    <div class="idle-warning-actions">
                        <button onclick="document.body.click()">Stay Signed In</button>
                        <button onclick="window.dispatchEvent(new CustomEvent('forceLogout'))">Sign Out Now</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Remove modal when user shows activity
            const removeModal = () => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            };
            document.addEventListener('click', removeModal, { once: true });
        }
    };

    const handleLogout = async () => {
        if (authContext?.token) {
            try {
                await auth.signOut();
            } catch (error) {
                console.error('Error during logout:', error);
            }

            setAuth({});
            navigate('/signin', {
                state: { message: 'You have been logged out due to inactivity.' }
            });
        }
    };

    useEffect(() => {
        if (!authContext?.token) return;

        // Activity events to monitor
        const events = [
            'mousedown',
            'mousemove',
            'keydown',
            'scroll',
            'touchstart',
            'click',
            'keypress'
        ];

        // Handle user activity
        const handleActivity = () => {
            resetTimers();
        };

        // Add event listeners
        events.forEach(event => {
            document.addEventListener(event, handleActivity);
        });

        // Handle force logout
        const handleForceLogout = () => {
            handleLogout();
        };
        window.addEventListener('forceLogout', handleForceLogout);

        // Initial timer setup
        resetTimers();

        // Periodic check for idle timeout
        const intervalId = setInterval(() => {
            const idleTime = Date.now() - lastActivity.current;
            
            if (idleTime >= IDLE_TIMEOUT) {
                handleLogout();
            } else if (idleTime >= WARNING_TIMEOUT && !warningShown.current) {
                showWarning();
            }
        }, CHECK_INTERVAL);

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
            window.removeEventListener('forceLogout', handleForceLogout);
            clearInterval(intervalId);
            if (warningTimer.current) clearTimeout(warningTimer.current);
            if (logoutTimer.current) clearTimeout(logoutTimer.current);
        };
    }, [authContext?.token]);

    return <>{children}</>;
};

export default ActivityMonitor;
