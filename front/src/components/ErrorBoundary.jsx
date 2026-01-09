import React, { Component } from 'react';
import { withRouter } from '../utils/withRouter';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log error to your error tracking service
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleRefresh = () => {
        window.location.reload();
    };

    handleNavigateHome = () => {
        this.props.navigate('/');
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h1>Oops! Something went wrong</h1>
                        <p>We apologize for the inconvenience. Here's what you can do:</p>
                        
                        <div className="error-actions">
                            <button 
                                onClick={this.handleRefresh}
                                className="btn btn-primary"
                            >
                                Refresh Page
                            </button>
                            <button 
                                onClick={this.handleNavigateHome}
                                className="btn btn-secondary"
                            >
                                Go to Home Page
                            </button>
                        </div>

                        <div className="error-details">
                            <p>If the problem persists, please contact support:</p>
                            <ul>
                                <li>Phone: (614) 868-3225</li>
                                <li>Email: support@guardianangelha.com</li>
                            </ul>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="error-debug">
                                <summary>Error Details</summary>
                                <pre>{this.state.error?.toString()}</pre>
                                <pre>{this.state.errorInfo?.componentStack}</pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default withRouter(ErrorBoundary);
