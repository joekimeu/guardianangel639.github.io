import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { DarkModeContext } from './DarkModeContext';
import './prospective.css'; // New CSS file for this page

export default function Prospective() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`prospective-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Container className="text-center">
        <h1 className="page-title">Join Guardian Angel Health Agency</h1>
        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <Card className="benefit-card mb-5">
              <Card.Body>
                <h2 className="benefit-title">Commitment to Positive Patient Outcomes</h2>
                <p className="benefit-description">
                  We work with patients to provide care of the utmost quality.
                </p>
              </Card.Body>
            </Card>

            <Card className="benefit-card mb-5">
              <Card.Body>
                <h2 className="benefit-title">Experienced Medical Professionals</h2>
                <p className="benefit-description">
                  We host nursing staff with 20+ years of experience.
                </p>
              </Card.Body>
            </Card>

            <Card className="benefit-card mb-5">
              <Card.Body>
                <h2 className="benefit-title">Competitive Pay & Flexible Hours</h2>
                <p className="benefit-description">
                  We offer great pay and flexible hours that can fit into your schedule.
                </p>
              </Card.Body>
            </Card>

            <Card className="benefit-card mb-5">
              <Card.Body>
                <h2 className="benefit-title">Start as Soon as You Are Available</h2>
                <p className="benefit-description">
                  We offer a quick yet comprehensive onboarding and training process.
                </p>
              </Card.Body>
            </Card>

            <Card className="benefit-card mb-5">
              <Card.Body>
                <h2 className="benefit-title">Exceptional Home Health Care that Benefits Society</h2>
                <p className="benefit-description">
                  We improve communities by prioritizing patients, promoting employee well-being, and giving back.
                </p>
              </Card.Body>
            </Card>

            <div className="text-center mt-4 mb-5"> {/* Add mb-5 for margin-bottom */}
              <Button variant="success" href="#application" className="apply-button">
                Apply Now!
              </Button>
            </div>

          </Col>
        </Row>
      </Container>
    </div>
  );
}
