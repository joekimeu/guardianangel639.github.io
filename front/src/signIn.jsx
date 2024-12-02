import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthProvider';
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import './signIn.css'; // New CSS file for custom styling

export default function SignIn() {
  const { login } = useContext(AuthContext);
  const [data, setData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('https://gaha-website-c6534f8cf004.herokuapp.com/signin', data);
      if (res.data.token) {
        login(res.data.token);
        navigate('/about');
      } else {
        setError("Failed to sign in: No token received");
      }
    } catch (err) {
      setError("Failed to sign in: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`signin-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="signin-card shadow">
        <h2 className="signin-title">Sign In</h2>
        {error && <div className="signin-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              id="username"
              value={data.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="signin-links mt-3 text-center">
          <Link to="/forgot-password" className="signin-link">Forgot Password?</Link>
          <Link to="/create-account" className="signin-link mt-2">Create New Account</Link>
        </div>
      </div>
    </div>
  );
}
