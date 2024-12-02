import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { DarkModeContext } from './DarkModeContext'; // Assuming you have a context for dark mode
import './footer.css';

export default function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer className={`footer-content ${darkMode ? 'footer-dark' : 'footer-light'}`}>
      <Container>
        <Row>
          <Col className="text-center">
            <p>&copy; {new Date().getFullYear()} Guardian Angel Health Agency LLC. All rights reserved.</p>
            <p>
              639 S. Hamilton Road, Whitehall, Ohio 43213 | 
              Phone: (614) 868-3225 | Fax: (614) 868-3437
            </p>
            <p>
              <a href="mailto:office.manager@guardianangelha.com" className="footer-link">
                Email Us
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
