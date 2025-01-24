import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { DarkModeContext } from './DarkModeContext';
import './trainings.css';
import { useContext } from 'react';

export default function Trainings() {
  const nursingTrainings = [
    { month: 'January', link: 'https://forms.office.com/r/BjGLau5FM9' },
    { month: 'February', link: 'https://forms.office.com/r/MhH9cUjVQe' },
    { month: 'March', link: 'https://forms.office.com/r/HT5gS5JRE0' },
    { month: 'April', link: 'https://forms.office.com/r/11DUGNYzrf' },
    { month: 'May', link: 'https://forms.office.com/r/53nRKshVL5' },
    { month: 'June', link: 'https://forms.office.com/r/iaM6iSmfRG' },
    { month: 'July', link: 'https://forms.office.com/r/4aNPpkUiiA' },
    { month: 'August', link: 'https://forms.office.com/r/X1rRN7CMjB' },
    { month: 'September', link: 'https://forms.office.com/r/Fyianwjdij' },
    { month: 'October', link: 'https://forms.office.com/r/Bqsj3VNypz' },
    { month: 'November', link: 'https://forms.office.com/r/1GFs5AWsR0' },
    { month: 'December', link: 'https://forms.office.com/r/XmL8EWB9Ku' },
  ];

  const hhaTrainings = [
    { month: 'January', link: 'https://forms.office.com/r/BjGLau5FM9' },
    { month: 'February', link: 'https://forms.office.com/r/MhH9cUjVQe' },
    { month: 'March', link: 'https://forms.office.com/r/HT5gS5JRE0' },
    { month: 'April', link: 'https://forms.office.com/r/11DUGNYzrf' },
    { month: 'May', link: 'https://forms.office.com/r/53nRKshVL5' },
    { month: 'June', link: 'https://forms.office.com/r/iaM6iSmfRG' },
    { month: 'July', link: 'https://forms.office.com/r/4aNPpkUiiA' },
    { month: 'August', link: 'https://forms.office.com/r/S6evSnr4Ez' },
    { month: 'September', link: 'https://forms.office.com/r/DZ6gUxbimt' },
    { month: 'October', link: 'https://forms.office.com/r/jAnLPbTtzv' },
    { month: 'November', link: 'https://forms.office.com/r/XmL8EWB9Ku' },
    { month: 'December', link: 'https://forms.office.com/r/XmL8EWB9Ku' },
  ];

  const documents = [
    { name: 'DODD Document', link: '#document1' },
    { name: 'RN/LPN Visit Document', link: '#document2' },
    { name: 'HHA Timesheet Document', link: '#document3' },
    { name: 'Passport Document', link: '#document4' },
    { name: 'Incident Report Document', link: '#document5' }
  ];

  const { darkMode } = useContext(DarkModeContext);

  return (
    <Container fluid className="trainings-page mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className={`trainings-card ${darkMode ? 'card-dark' : 'card-light'} shadow-lg rounded`}>
            <Card.Body>
              <h1 className="section-title text-center mb-5">Monthly Trainings</h1>

              <Row className="training-section mb-4">
                <Col md={6} className="mb-4">
                  <Card className="training-category-card shadow-sm">
                    <Card.Body>
                      <h2 className="category-title text-center">Nurses Training</h2>
                      <p className="text-center description">
                        Access the latest training materials for nurses by month.
                      </p>
                      <div className="button-grid">
                        {nursingTrainings.map((training, index) => (
                          <Button 
                            key={index} 
                            variant="outline-primary" 
                            href={training.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="month-button"
                          >
                            {training.month}
                          </Button>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-4">
                  <Card className="training-category-card shadow-sm">
                    <Card.Body>
                      <h2 className="category-title text-center">Home Health Aides Training</h2>
                      <p className="text-center description">
                        Access the latest training materials for home health aides by month.
                      </p>
                      <div className="button-grid">
                        {hhaTrainings.map((training, index) => (
                          <Button 
                            key={index} 
                            variant="outline-primary" 
                            href={training.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="month-button"
                          >
                            {training.month}
                          </Button>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <h1 className="section-title text-center mb-5">Employee Documents</h1>

              <Row className="justify-content-center">
                <Col md={8}>
                  <Card className="document-card shadow-sm">
                    <Card.Body>
                      <p className="text-center description">
                        Employees can print the following documents:
                      </p>
                      <div className="button-grid">
                        {documents.map((doc, index) => (
                          <Button 
                            key={index} 
                            variant="outline-primary" 
                            href={doc.link} 
                            className="document-button"
                          >
                            {doc.name}
                          </Button>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="text-center mt-5">
                <Button variant="success" href="https://nationalcprfoundation.com/cpr-recertification-renewal/" className="special-button me-3">CPR Training</Button>
                <Button variant="warning" href="https://screening.mhanational.org/screening-tools/" className="special-button me-3">Mental Health Quiz</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
