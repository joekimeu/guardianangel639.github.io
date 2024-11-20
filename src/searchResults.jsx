// SearchResults.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import { useContext } from 'react';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');

    if (query) {
      setLoading(true);
      fetchSearchResults(query);
    }
  }, [location.search]);

  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(`https://gaha-website-c6534f8cf004.herokuapp.com/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching search results');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <h1>Search Results</h1>
      <Row>
        {results.map((result) => (
          <Col key={result.username} md={4} className="mb-4">
           <Card className={`${darkMode ? 'card-dark' : 'card-light'} rounded p-5 shadow-lg`}>
              <Card.Body>
                <Card.Title>{result.username}</Card.Title>
                <Card.Text>{result.firstname} {result.lastname}</Card.Text>
                <Card.Text>{result.position}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}