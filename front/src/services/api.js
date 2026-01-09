import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL ||           // pick up from .env  ⇠ recommended
    "https://gaha-website-c6534f8cf004.herokuapp.com",  // <- your hard-coded Heroku root
  withCredentials: true,
  timeout: 10_000,
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

// Authentication API
export const auth = {
    signIn: async (credentials) => {
        try {
            const response = await api.post('/signin', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Sign in failed');
        }
    },

    signOut: async () => {
        try {
            await api.post('/signout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Sign out error:', error);
            // Still remove local storage items even if API call fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    verifyToken: async () => {
        try {
            const response = await api.get('/verify-token');
            return response.data;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    }
};

// Employee API
export const employees = {
    getAll: async (page = 1, limit = 10) => {
        try {
            const response = await api.get('/employees', { params: { page, limit } });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch employees');
        }
    },

    search: async (query) => {
        try {
            const response = await api.get('/search', { params: { q: query } });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Search failed');
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/employees/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch employee');
        }
    }
};

// Clock In/Out API
export const clockInOut = {
    getCurrentStatus: async () => {
        try {
            const response = await api.get('/currentstatus');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get current status');
        }
    },

    clockIn: async () => {
        try {
            const response = await api.post('/clockin');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Clock in failed');
        }
    },

    clockOut: async () => {
        try {
            const response = await api.post('/clockout');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Clock out failed');
        }
    },

    startLunch: async () => {
        try {
            const response = await api.post('/lunchstart');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to start lunch');
        }
    },

    endLunch: async () => {
        try {
            const response = await api.post('/lunchend');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to end lunch');
        }
    },

    getHistory: async (username, page = 1, limit = 10) => {
        try {
            const response = await api.get(`/clockhistory/${username}`, {
                params: { limit, offset: (page - 1) * limit }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to fetch history');
        }
    }
};

// Error Handler
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        const message = error.response.data?.error || error.response.data?.message || 'An error occurred';
        const status = error.response.status;
        
        switch (status) {
            case 400:
                return { type: 'VALIDATION_ERROR', message };
            case 401:
                return { type: 'AUTH_ERROR', message };
            case 403:
                return { type: 'PERMISSION_ERROR', message };
            case 404:
                return { type: 'NOT_FOUND', message };
            case 429:
                return { type: 'RATE_LIMIT', message };
            default:
                return { type: 'SERVER_ERROR', message };
        }
    } else if (error.request) {
        // Request made but no response
        return { 
            type: 'NETWORK_ERROR',
            message: 'Unable to connect to server'
        };
    } else {
        // Something else went wrong
        return {
            type: 'CLIENT_ERROR',
            message: error.message || 'An unexpected error occurred'
        };
    }
};

export default {
    auth,
    employees,
    clockInOut,
    handleApiError
};
