import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications, NOTIFICATION_TYPES } from './NotificationSystem';

const Header = () => {
    const navigate = useNavigate();
    const { 
        auth,
        isAuthenticated,
        getFullName,
        isAdmin,
        isManager,
        handleLogout,
        is2FAEnabled,
        getLastLogin,
        getAccountStatus
    } = useAuth();
    const { addNotification } = useNotifications();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSignOut = async () => {
        try {
            await handleLogout();
            navigate('/signin');
        } catch (error) {
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                title: 'Error',
                message: 'Failed to sign out. Please try again.',
                duration: 5000
            });
        }
    };

    const getSecurityStatus = () => {
        const status = [];
        if (is2FAEnabled()) {
            status.push('2FA Enabled');
        }
        if (auth?.user?.requiresPasswordChange) {
            status.push('Password Change Required');
        }
        return status;
    };

    const formatLastLogin = () => {
        const lastLogin = getLastLogin();
        if (!lastLogin) return 'First login';
        return new Date(lastLogin).toLocaleString();
    };

    const getStatusColor = () => {
        const status = getAccountStatus();
        switch (status) {
            case 'active':
                return 'status-active';
            case 'suspended':
                return 'status-suspended';
            case 'inactive':
                return 'status-inactive';
            default:
                return '';
        }
    };

    return (
        <header className="header">
            <div className="header-logo">
                <Link to="/">
                    <img src="/logo.png" alt="Guardian Angel HA" />
                </Link>
            </div>

            <nav className="header-nav">
                {isAuthenticated ? (
                    <>
                        <Link to="/clockinout">Clock In/Out</Link>
                        {isManager() && (
                            <>
                                <Link to="/employees">Employees</Link>
                                <Link to="/search">Search</Link>
                            </>
                        )}
                        <Link to="/trainings">Trainings</Link>
                        {isAdmin() && (
                            <Link to="/operating-committee">Operating Committee</Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                    </>
                )}
            </nav>

            <div className="header-auth">
                {isAuthenticated ? (
                    <div className="user-menu-container">
                        <button 
                            className="user-menu-trigger"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <div className="user-info">
                                <span className="user-name">{getFullName()}</span>
                                <span className={`user-status ${getStatusColor()}`}>
                                    {getAccountStatus()}
                                </span>
                            </div>
                        </button>

                        {showUserMenu && (
                            <div className="user-menu">
                                <div className="user-menu-header">
                                    <strong>{auth.user.username}</strong>
                                    <span className="user-position">{auth.user.position}</span>
                                </div>

                                <div className="security-status">
                                    {getSecurityStatus().map((status, index) => (
                                        <span key={index} className="security-badge">
                                            {status}
                                        </span>
                                    ))}
                                </div>

                                <div className="last-login">
                                    Last login: {formatLastLogin()}
                                </div>

                                <div className="user-menu-actions">
                                    <Link to="/profile" className="menu-item">
                                        Profile Settings
                                    </Link>
                                    <Link to="/security" className="menu-item">
                                        Security Settings
                                    </Link>
                                    {!is2FAEnabled() && (
                                        <Link to="/2fa-setup" className="menu-item security-action">
                                            Enable 2FA
                                        </Link>
                                    )}
                                    {auth.user.requiresPasswordChange && (
                                        <Link to="/change-password" className="menu-item security-action">
                                            Change Password
                                        </Link>
                                    )}
                                    <button 
                                        onClick={handleSignOut}
                                        className="menu-item sign-out"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/signin" className="sign-in-button">
                        Sign In
                    </Link>
                )}
            </div>

            <style jsx>{`
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 2rem;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .header-logo img {
                    height: 40px;
                }

                .header-nav {
                    display: flex;
                    gap: 2rem;
                }

                .header-nav a {
                    text-decoration: none;
                    color: #333;
                    font-weight: 500;
                }

                .user-menu-container {
                    position: relative;
                }

                .user-menu-trigger {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .user-name {
                    font-weight: 500;
                }

                .user-status {
                    font-size: 0.75rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                }

                .status-active {
                    background: #28a745;
                    color: white;
                }

                .status-suspended {
                    background: #dc3545;
                    color: white;
                }

                .status-inactive {
                    background: #6c757d;
                    color: white;
                }

                .user-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    padding: 1rem;
                    min-width: 240px;
                    z-index: 1000;
                }

                .user-menu-header {
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 0.5rem;
                }

                .user-position {
                    display: block;
                    font-size: 0.875rem;
                    color: #666;
                }

                .security-status {
                    display: flex;
                    gap: 0.5rem;
                    margin: 0.5rem 0;
                }

                .security-badge {
                    font-size: 0.75rem;
                    padding: 0.25rem 0.5rem;
                    background: #f8f9fa;
                    border-radius: 12px;
                    color: #666;
                }

                .last-login {
                    font-size: 0.875rem;
                    color: #666;
                    margin-bottom: 1rem;
                }

                .user-menu-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .menu-item {
                    display: block;
                    padding: 0.5rem;
                    text-decoration: none;
                    color: #333;
                    border-radius: 4px;
                }

                .menu-item:hover {
                    background: #f8f9fa;
                }

                .security-action {
                    color: #dc3545;
                }

                .sign-out {
                    color: #dc3545;
                    border: none;
                    background: none;
                    cursor: pointer;
                    text-align: left;
                    width: 100%;
                }

                .sign-in-button {
                    padding: 0.5rem 1rem;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 4px;
                    font-weight: 500;
                }
            `}</style>
        </header>
    );
};

export default Header;
