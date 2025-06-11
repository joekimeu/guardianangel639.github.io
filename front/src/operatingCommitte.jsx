import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useDarkMode } from './hooks/useDarkMode';
import useRevealAnimations from './hooks/useRevealAnimations';
import RouteTransition from './components/RouteTransition';
import './operatingCommittee.css';

export default function OperatingCommittee() {
  const { darkMode } = useDarkMode();
  useRevealAnimations(); // Add the hook to handle reveal animations

  return (
    <RouteTransition>
      <div className={`committee-page ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <Container className="text-center">
          <h1 className="page-title reveal">Operating Committee</h1>
          <Row className="justify-content-center mt-5">
            <Col md={8}>
              <Card className="committee-card mb-5 reveal">
                <Card.Body>
                  <Card.Title className="committee-title">Thomas Kamau, PhD, MPH, MBA</Card.Title>
                  <Card.Subtitle className="committee-role">Founder and Board Member</Card.Subtitle>
                  <Card.Text className="committee-description">
                    Thomas Kamau is the Founder and a current Board Member of Guardian Angel Health Agency. He also serves as an Associate Professor of Health Sciences at Ohio University in Athens, Ohio, where he coordinates the Health Services Administration Program, teaches courses in Health Service Administration. and has published research papers in epidemiology.
                  </Card.Text>
                  <p className="contact-info">
                    <strong>Contact:</strong> <a href="mailto:thomas@guardianangelha.com" className="contact-link">thomas@guardianangelha.com</a>
                  </p>
                </Card.Body>
              </Card>

              <Card className="committee-card mb-5 reveal">
                <Card.Body>
                  <Card.Title className="committee-title">Anne Mulama, MSN, RN</Card.Title>
                  <Card.Subtitle className="committee-role">Chief Executive Officer and Director of Clinical Services</Card.Subtitle>
                  <Card.Text className="committee-description">
                    Anne Mulama is the Director of Clinical Services at Guardian Angel Health Agency, bringing 20 years of diverse nursing experience across top healthcare institutions. With a Master's in Nursing, Anne has honed her clinical expertise at respected hospitals, including The Ohio State University, Cleveland Clinic, OhioHealth, Mount Carmel Health System, and Alta Bates Summit Medical in San Francisco, California.
                  </Card.Text>
                  <p className="contact-info">
                    <strong>Contact:</strong> <a href="mailto:anne@guardianangelha.com" className="contact-link">anne@guardianangelha.com</a>
                  </p>
                </Card.Body>
              </Card>

              <Card className="committee-card mb-5 reveal">
                <Card.Body>
                  <Card.Title className="committee-title">Dora Boamoah, RN</Card.Title>
                  <Card.Subtitle className="committee-role">Office Manager</Card.Subtitle>
                  <Card.Text className="committee-description">
                    Dora Boamoah is a Registered Nurse and the Office Manager at Guardian Angel Health Agency.
                  </Card.Text>
                  <p className="contact-info">
                    <strong>Contact:</strong> <a href="mailto:office.manager@guardianangelha.com" className="contact-link">office.manager@guardianangelha.com</a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </RouteTransition>
  );
}
