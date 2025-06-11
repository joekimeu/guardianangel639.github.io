import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { employees, handleApiError } from './services/api';
import { useAuth } from './hooks/useAuth';
import debounce from 'lodash/debounce';
import './searchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useAuth();
    
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        position: '',
        sortBy: 'lastname',
        sortOrder: 'asc'
    });

    // Get initial search term from URL query params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('q') || '';
        setSearchTerm(query);
        if (query) {
            performSearch(query);
        }
    }, [location.search]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => {
            performSearch(query);
        }, 300),
        []
    );

    const performSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await employees.search(query);
            let results = response.data || [];

            // Apply filters
            if (filters.position) {
                results = results.filter(emp => emp.position === filters.position);
            }

            // Apply sorting
            results.sort((a, b) => {
                const aValue = a[filters.sortBy].toLowerCase();
                const bValue = b[filters.sortBy].toLowerCase();
                return filters.sortOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            });

            setSearchResults(results);
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        
        // Update URL with search query
        const params = new URLSearchParams(location.search);
        if (query) {
            params.set('q', query);
        } else {
            params.delete('q');
        }
        navigate({ search: params.toString() }, { replace: true });
        
        debouncedSearch(query);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Re-apply search with new filters
        performSearch(searchTerm);
    };

    const getUniquePositions = () => {
        const positions = new Set(searchResults.map(emp => emp.position));
        return Array.from(positions);
    };

    return (
        <div className="search-results">
            <div className="search-header">
                <h1>Employee Search</h1>
                
                <div className="search-controls">
                    <div className="search-input">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by name, username, or position..."
                            className="form-control"
                        />
                    </div>

                    <div className="filters">
                        <select
                            name="position"
                            value={filters.position}
                            onChange={handleFilterChange}
                            className="form-control"
                        >
                            <option value="">All Positions</option>
                            {getUniquePositions().map(position => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </select>

                        <select
                            name="sortBy"
                            value={filters.sortBy}
                            onChange={handleFilterChange}
                            className="form-control"
                        >
                            <option value="lastname">Sort by Last Name</option>
                            <option value="firstname">Sort by First Name</option>
                            <option value="position">Sort by Position</option>
                        </select>

                        <select
                            name="sortOrder"
                            value={filters.sortOrder}
                            onChange={handleFilterChange}
                            className="form-control"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading">Searching...</div>
            ) : searchResults.length > 0 ? (
                <div className="results-grid">
                    {searchResults.map(employee => (
                        <div key={employee.username} className="employee-card">
                            <div className="employee-info">
                                <h3>{employee.firstname} {employee.lastname}</h3>
                                <p className="position">{employee.position}</p>
                                <p className="username">@{employee.username}</p>
                            </div>
                            {auth.user.position === 'Administrator' && (
                                <div className="employee-actions">
                                    <button
                                        onClick={() => navigate(`/employees/${employee.username}`)}
                                        className="btn btn-primary"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => navigate(`/employees/${employee.username}/edit`)}
                                        className="btn btn-secondary"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : searchTerm ? (
                <div className="no-results">
                    No employees found matching "{searchTerm}"
                </div>
            ) : (
                <div className="search-prompt">
                    Enter a search term to find employees
                </div>
            )}
        </div>
    );
};

export default SearchResults;
