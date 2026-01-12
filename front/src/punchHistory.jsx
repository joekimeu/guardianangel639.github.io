import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './hooks/useAuth';
import { clockInOut, handleApiError } from './services/api';
import { useParams, Navigate } from 'react-router-dom';

import './punchHistory.css';

const PunchHistory = () => {
  const { auth } = useAuth();
  const { username } = useParams();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dateFilter, setDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const itemsPerPage = 10;

  const targetUsername = username;

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, dateFilter, sortOrder, username]);

  // --- Helpers: safe parsing for Postgres DATE + TIME ---

  // entry.date can be "2026-01-08" or similar; make a reliable local Date
  const parsePgDate = (dateStr) => {
    if (!dateStr) return null;
    // If it's already a Date object
    if (dateStr instanceof Date) return dateStr;

    // Common pg DATE string: "YYYY-MM-DD"
    const m = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const d = parseInt(m[3], 10);
      return new Date(y, mo, d);
    }

    // Fallback (might still work)
    const fallback = new Date(dateStr);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  };

  // TIME like "HH:MM:SS" (or "HH:MM:SS.sss") => {h,m,s}
  const parsePgTime = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr instanceof Date) {
      return { h: timeStr.getHours(), m: timeStr.getMinutes(), s: timeStr.getSeconds() };
    }

    const m = String(timeStr).match(/^(\d{2}):(\d{2})(?::(\d{2}))?/);
    if (!m) return null;
    return {
      h: parseInt(m[1], 10),
      m: parseInt(m[2], 10),
      s: parseInt(m[3] || '0', 10),
    };
  };

 // Combine DATE + TIME into a real Date object (interpret TIME as UTC)
const combineDateTime = (dateStr, timeStr) => {
  const d = parsePgDate(dateStr);
  const t = parsePgTime(timeStr);
  if (!d || !t) return null;

  // Build an absolute UTC timestamp, then let JS render it in local time
  const utcMillis = Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    t.h,
    t.m,
    t.s,
    0
  );

  return new Date(utcMillis);
};


  const formatDateOnly = (dateStr) => {
    const d = parsePgDate(dateStr);
    if (!d) return 'N/A';
    return d.toLocaleDateString('en-US');
  };

  const formatDateTime = (dateStr, timeStr) => {
    const dt = combineDateTime(dateStr, timeStr);
    if (!dt) return 'N/A';
    return dt.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const diffMinutes = (startTimeStr, endTimeStr) => {
    // use a fixed date to compute durations
    const start = combineDateTime('2000-01-01', startTimeStr);
    const end = combineDateTime('2000-01-01', endTimeStr);
    if (!start || !end) return null;
    return (end - start) / (1000 * 60);
  };

  const calculateDuration = (start, end) => {
    const mins = diffMinutes(start, end);
    if (mins == null) return 'N/A';
    const hours = Math.floor(mins / 60);
    const minutes = Math.floor(mins % 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateTotalHours = (entry) => {
    if (!entry.clockin_time || !entry.clockout_time) return 'N/A';

    let mins = diffMinutes(entry.clockin_time, entry.clockout_time);
    if (mins == null) return 'N/A';

    if (entry.lunch_start && entry.lunch_end) {
      const lunchMins = diffMinutes(entry.lunch_start, entry.lunch_end);
      if (lunchMins != null) mins -= lunchMins;
    }

    const hours = Math.floor(mins / 60);
    const minutes = Math.floor(mins % 60);
    return `${hours}h ${minutes}m`;
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // NOTE: backend currently returns an ARRAY of rows (no total count)
      const rows = await clockInOut.getHistory(targetUsername, page, itemsPerPage);;

      let data = Array.isArray(rows) ? rows : [];

      // Apply date filter: input type="date" gives "YYYY-MM-DD"
      if (dateFilter) {
        data = data.filter((entry) => String(entry.date).startsWith(dateFilter));
      }

      // Apply sorting by combined clock-in datetime (date + clockin_time)
      data.sort((a, b) => {
        const aDT = combineDateTime(a.date, a.clockin_time);
        const bDT = combineDateTime(b.date, b.clockin_time);

        const aVal = aDT ? aDT.getTime() : 0;
        const bVal = bDT ? bDT.getTime() : 0;

        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });

      setHistory(data);

      // Because backend pagination is LIMIT/OFFSET but doesn't return total,
      // we can only do a best-effort totalPages.
      // If you want exact totals, we should add an endpoint returning count.
      setTotalPages((prev) => Math.max(prev, page)); // keep UI stable
    } catch (err) {
      const errorDetails = handleApiError(err);
      setError(errorDetails.message);
    } finally {
      setLoading(false);
    }
  };

  const canGoNext = useMemo(() => history.length === itemsPerPage, [history.length]);

  return (
    <div className="punch-history">
      <h1>Punch History</h1>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="dateFilter">Filter by Date:</label>
          <input
            type="date"
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => {
              setPage(1);
              setDateFilter(e.target.value);
            }}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sortOrder">Sort Order:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => {
              setPage(1);
              setSortOrder(e.target.value);
            }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading punch history...</div>
      ) : (
        <>
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Lunch Start</th>
                  <th>Lunch End</th>
                  <th>Clock Out</th>
                  <th>Lunch Duration</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>{formatDateOnly(entry.date)}</td>
                    <td>{formatDateTime(entry.date, entry.clockin_time)}</td>
                    <td>{formatDateTime(entry.date, entry.lunch_start)}</td>
                    <td>{formatDateTime(entry.date, entry.lunch_end)}</td>
                    <td>{formatDateTime(entry.date, entry.clockout_time)}</td>
                    <td>{calculateDuration(entry.lunch_start, entry.lunch_end)}</td>
                    <td>{calculateTotalHours(entry)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary"
            >
              Previous
            </button>

            <span className="page-info">Page {page}</span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!canGoNext}
              className="btn btn-secondary"
              title={!canGoNext ? 'No more results' : 'Next'}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PunchHistory;
