import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';
import { useNotifications, NOTIFICATION_TYPES } from './components/NotificationSystem';

const Layout = ({ children }) => {
    const location = useLocation();
    const { auth, isAuthenticated, requiresPasswordChange, is2FAEnabled } = useAuth();
    const { addNotification } = useNotifications();

    // Security notifications
    useEffect(() => {
        if (!isAuthenticated) return;

        // Check for security recommendations
        if (!is2FAEnabled()) {
            addNotification({
                type: NOTIFICATION_TYPES.SECURITY,
                title: 'Security Recommendation',
                message: 'Enable two-factor authentication to better protect your account.',
                persistent: true,
                action: {
                    label: 'Enable 2FA',
                    onClick: () => window.location.href = '/2fa-setup'
                }
            });
        }

        if (requiresPasswordChange()) {
            addNotification({
                type: NOTIFICATION_TYPES.WARNING,
                title: 'Action Required',
                message: 'Please change your password to continue using the system.',
                persistent: true,
                action: {
                    label: 'Change Password',
                    onClick: () => window.location.href = '/change-password'
                }
            });
        }
    }, [isAuthenticated, is2FAEnabled, requiresPasswordChange]);

    // Track page views for security monitoring
    useEffect(() => {
        if (!isAuthenticated) return;

        const logPageView = async () => {
            try {
                await fetch('/api/log-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    },
                    body: JSON.stringify({
                        type: 'PAGE_VIEW',
                        path: location.pathname,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (error) {
                console.error('Failed to log page view:', error);
            }
        };

        logPageView();
    }, [location.pathname, isAuthenticated]);

    return (
        <div className="layout">
            <Header />
            
            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Guardian Angel Health Agency</h3>
                        <p>Providing quality healthcare services</p>
                    </div>
                    <div className="footer-section">
                        <h3>Contact</h3>
                        <p>Phone: (614) 868-3225</p>
                        <p>Email: info@guardianangelha.com</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                            {isAuthenticated && (
                                <>
                                    <li><a href="/security">Security Settings</a></li>
                                    <li><a href="/help">Help & Support</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Guardian Angel Health Agency. All rights reserved.</p>
                    {isAuthenticated && (
                        <div className="security-info">
                            <span>Secure Connection</span>
                            <span>•</span>
                            <span>Last Activity: {new Date().toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>
            </footer>

            <style jsx>{`
                .layout {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .main-content {
                    flex: 1;
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }

                .footer {
                    background: #f8f9fa;
                    padding: 2rem 0;
                    margin-top: auto;
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    padding: 0 2rem;
                }

                .footer-section h3 {
                    color: #333;
                    margin-bottom: 1rem;
                }

                .footer-section ul {
                    list-style: none;
                    padding: 0;
                }

                .footer-section ul li {
                    margin-bottom: 0.5rem;
                }

                .footer-section a {
                    color: #666;
                    text-decoration: none;
                }

                .footer-section a:hover {
                    color: #007bff;
                }

                .footer-bottom {
                    max-width: 1200px;
                    margin: 2rem auto 0;
                    padding: 1rem 2rem;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #666;
                }

                .security-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }

                @media (max-width: 768px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                    }

                    .footer-bottom {
                        flex-direction: column;
                        text-align: center;
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Layout;
