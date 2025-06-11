import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employees, handleApiError } from './services/api';
import { useAuth } from './hooks/useAuth';
import './allUsers.css';

const AllUsers = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        position: '',
        sortBy: 'lastname',
        sortOrder: 'asc'
    });
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [page, filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await employees.getAll(page, itemsPerPage);
            let filteredUsers = response.data || [];

            // Apply position filter
            if (filters.position) {
                filteredUsers = filteredUsers.filter(user => 
                    user.position === filters.position
                );
            }

            // Apply sorting
            filteredUsers.sort((a, b) => {
                const aValue = a[filters.sortBy].toLowerCase();
                const bValue = b[filters.sortBy].toLowerCase();
                return filters.sortOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            });

            setUserList(filteredUsers);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
        } catch (err) {
            const errorDetails = handleApiError(err);
            setError(errorDetails.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(1); // Reset to first page when filters change
    };

    const getUniquePositions = () => {
        const positions = new Set(userList.map(user => user.position));
        return Array.from(positions);
    };

    const handleViewDetails = (username) => {
        navigate(`/employees/${username}`);
    };

    const handleEdit = (username) => {
        navigate(`/employees/${username}/edit`);
    };

    const isAdmin = auth.user.position === 'Administrator';

    return (
        <div className="all-users">
            <div className="users-header">
                <h1>All Employees</h1>
                
                {isAdmin && (
                    <button
                        onClick={() => navigate('/employees/new')}
                        className="btn btn-primary"
                    >
                        Add New Employee
                    </button>
                )}
            </div>

            <div className="filters-section">
                <div className="filter-group">
                    <label htmlFor="position">Position:</label>
                    <select
                        id="position"
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
                </div>

                <div className="filter-group">
                    <label htmlFor="sortBy">Sort By:</label>
                    <select
                        id="sortBy"
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                        className="form-control"
                    >
                        <option value="lastname">Last Name</option>
                        <option value="firstname">First Name</option>
                        <option value="position">Position</option>
                        <option value="username">Username</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sortOrder">Order:</label>
                    <select
                        id="sortOrder"
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

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loading">Loading employees...</div>
            ) : (
                <>
                    <div className="users-table-container">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Position</th>
                                    <th>Email</th>
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {userList.map(user => (
                                    <tr key={user.username}>
                                        <td>{user.firstname} {user.lastname}</td>
                                        <td>@{user.username}</td>
                                        <td>{user.position}</td>
                                        <td>{user.email}</td>
                                        {isAdmin && (
                                            <td className="actions">
                                                <button
                                                    onClick={() => handleViewDetails(user.username)}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(user.username)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="btn btn-secondary"
                        >
                            Previous
                        </button>
                        <span className="page-info">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="btn btn-secondary"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AllUsers;
