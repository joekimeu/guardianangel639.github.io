import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for saved auth state on mount
    useEffect(() => {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
            try {
                const parsedAuth = JSON.parse(savedAuth);
                setAuth(parsedAuth);
            } catch (error) {
                console.error('Failed to parse saved auth state:', error);
                localStorage.removeItem('auth');
            }
        }
        setIsLoading(false);
    }, []);

    // Enhanced setAuth that handles both state and persistence
    const updateAuth = (newAuth) => {
        setAuth(newAuth);
        if (newAuth) {
            try {
                localStorage.setItem('auth', JSON.stringify(newAuth));
            } catch (error) {
                console.error('Failed to save auth state:', error);
            }
        } else {
            localStorage.removeItem('auth');
        }
    };

    // Sign out function
    const signOut = () => {
        updateAuth(null);
    };

    // Provide loading state to prevent flash of unauthorized content
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            auth, 
            setAuth: updateAuth,
            signOut,
            isAuthenticated: !!auth?.user,
            isAdmin: auth?.roles?.includes('Admin') || false,
            isUser: auth?.roles?.includes('User') || false
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
