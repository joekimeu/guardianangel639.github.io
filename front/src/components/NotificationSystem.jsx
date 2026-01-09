import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';

// Context
const NotificationContext = createContext();

// Notification types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    SECURITY: 'security'
};

// Action types
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';

// Reducer
const notificationReducer = (state, action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return [...state, action.payload];
        case REMOVE_NOTIFICATION:
            return state.filter(notification => notification.id !== action.payload);
        case CLEAR_NOTIFICATIONS:
            return [];
        default:
            return state;
    }
};

// Provider Component
export const NotificationProvider = ({ children }) => {
    const [notifications, dispatch] = useReducer(notificationReducer, []);

    const addNotification = (notification) => {
        const id = uuidv4();
        const timestamp = new Date().toISOString();

        dispatch({
            type: ADD_NOTIFICATION,
            payload: {
                id,
                timestamp,
                ...notification
            }
        });

        // Auto-remove non-persistent notifications
        if (!notification.persistent) {
            setTimeout(() => {
                removeNotification(id);
            }, notification.duration || 5000);
        }

        // Log security notifications
        if (notification.type === NOTIFICATION_TYPES.SECURITY) {
            console.warn('Security Alert:', notification.message);
            // You could also send these to your security monitoring system
        }
    };

    const removeNotification = (id) => {
        dispatch({
            type: REMOVE_NOTIFICATION,
            payload: id
        });
    };

    const clearNotifications = () => {
        dispatch({ type: CLEAR_NOTIFICATIONS });
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            removeNotification,
            clearNotifications
        }}>
            {children}
            <NotificationContainer notifications={notifications} onRemove={removeNotification} />
        </NotificationContext.Provider>
    );
};

// Hook for using notifications
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

// Individual Notification Component
const Notification = ({ notification, onRemove }) => {
    const {
        id,
        type,
        title,
        message,
        persistent,
        action
    } = notification;

    useEffect(() => {
        // Add notification sound for security alerts
        if (type === NOTIFICATION_TYPES.SECURITY) {
            const audio = new Audio('/notification-sound.mp3');
            audio.play().catch(() => {}); // Ignore if browser blocks autoplay
        }
    }, [type]);

    const getIcon = () => {
        switch (type) {
            case NOTIFICATION_TYPES.SUCCESS:
                return '✓';
            case NOTIFICATION_TYPES.ERROR:
                return '✕';
            case NOTIFICATION_TYPES.WARNING:
                return '⚠';
            case NOTIFICATION_TYPES.SECURITY:
                return '🔒';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className={`notification notification-${type}`}>
            <div className="notification-icon">
                {getIcon()}
            </div>
            <div className="notification-content">
                {title && <h4>{title}</h4>}
                <p>{message}</p>
                {action && (
                    <button 
                        onClick={action.onClick}
                        className="notification-action"
                    >
                        {action.label}
                    </button>
                )}
            </div>
            {!persistent && (
                <button 
                    onClick={() => onRemove(id)}
                    className="notification-close"
                    aria-label="Close notification"
                >
                    ×
                </button>
            )}
            <style jsx>{`
                .notification {
                    display: flex;
                    align-items: flex-start;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    border-radius: 4px;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    animation: slideIn 0.3s ease-out;
                }

                .notification-success {
                    border-left: 4px solid #28a745;
                }

                .notification-error {
                    border-left: 4px solid #dc3545;
                }

                .notification-warning {
                    border-left: 4px solid #ffc107;
                }

                .notification-info {
                    border-left: 4px solid #17a2b8;
                }

                .notification-security {
                    border-left: 4px solid #dc3545;
                    background: #fff8f8;
                }

                .notification-icon {
                    margin-right: 1rem;
                    font-size: 1.25rem;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-content h4 {
                    margin: 0 0 0.25rem;
                }

                .notification-content p {
                    margin: 0;
                }

                .notification-action {
                    margin-top: 0.5rem;
                    padding: 0.25rem 0.5rem;
                    border: none;
                    border-radius: 4px;
                    background: #007bff;
                    color: white;
                    cursor: pointer;
                }

                .notification-close {
                    border: none;
                    background: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0 0.5rem;
                    color: #666;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

// Container Component
const NotificationContainer = ({ notifications, onRemove }) => {
    return createPortal(
        <div className="notification-container">
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    notification={notification}
                    onRemove={onRemove}
                />
            ))}
            <style jsx>{`
                .notification-container {
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: 9999;
                    width: 400px;
                    max-width: calc(100vw - 2rem);
                }
            `}</style>
        </div>,
        document.body
    );
};

// Example usage:
/*
import { useNotifications, NOTIFICATION_TYPES } from './NotificationSystem';

const YourComponent = () => {
    const { addNotification } = useNotifications();

    const handleError = () => {
        addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            title: 'Error',
            message: 'Something went wrong!',
            duration: 5000
        });
    };

    const handleSecurityAlert = () => {
        addNotification({
            type: NOTIFICATION_TYPES.SECURITY,
            title: 'Security Alert',
            message: 'Suspicious activity detected.',
            persistent: true,
            action: {
                label: 'View Details',
                onClick: () => {
                    // Handle action
                }
            }
        });
    };

    return <div>Your component content</div>;
};
*/

export default NotificationProvider;
