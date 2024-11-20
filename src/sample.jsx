import React from 'react';
import heroImage from './docs/cover.jpeg';
import { Container, Row, Col } from 'react-bootstrap';
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import { useContext } from 'react';

export default function Sample() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className="hero-wrapper-container">
      <Container>
        <div className="main-container breadcrumb-print-wrapper"></div>
        <div className="hero-panel hero-large">
          <Row 
            className="hero-item bg-right"
            style={{
              backgroundImage: `url("${heroImage}")`,
            }}
          >
            <Col xl={10} className="hero-content">
              <h2
                className="hero-title"
                aria-hidden="true"
                role="document"
                aria-label="To make this website accessible to screen reader, press combination of alt and 1 keys. To stop getting this message, press the combination of alt and 2 keys"
                style={{ fontSize: '2.5rem', fontFamily: 'Arial, sans-serif', fontWeight: '1000' }}
              >
                Welcome to the Molina Marketplace.
              </h2>
              <p className="hero-desc"></p>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}