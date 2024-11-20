import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { DarkModeContext } from './DarkModeContext';
import './trainings.css';
import { useContext } from 'react';

export default function Trainings() {
  const nursingTrainings = [
    { month: 'January', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdJAMhgbDS-El-TPlmnnEZ0A-gY-GYOj-jUwwCvfZbbCuznDQ/viewform?usp=send_form' },
    { month: 'February', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeBB2NNupxYOhA0kdeRmrHTdV1LB4yReKZDm9Kp7xT8_1OnRg/viewform' },
    { month: 'March', link: 'https://docs.google.com/forms/d/e/1FAIpQLSepHT-ISIlaXJdc18AGdBq8j7qbgPW4z4IbTXYg8ebNch5XkA/viewform?usp=send_form' },
    { month: 'April', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeGmszf2S5pml8uqcPCg6GbsddynFYzN4_ZwnrblCcv4Nsmig/viewform' },
    { month: 'May', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdz-zqN3YEJFpi0tpIRHzVO2XgMyABYs8Jw_SwOzwXTFaJTAg/viewform' },
    { month: 'June', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdisjJ5E20RbKPH2qIrXs7j6MnhM2Po-huEQGrMqxtYCr404g/viewform' },
    { month: 'July', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdxyZh2LKWfBULQo9GaV_o3WeWk893OtpO3qzZ9ETQiWOfwnA/viewform' },
    { month: 'August', link: 'https://docs.google.com/forms/d/e/1FAIpQLSfTwAFp9cpeVe3TZzg8-5BZLv_WKYeDhu-SpWY6Kia2QY_o0w/viewform' },
    { month: 'September', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeEs1qHHtFwEEBLupVrS2jYMVOXyxyM351A8Gz81Pct-NNv3g/viewform' },
    { month: 'October', link: 'https://docs.google.com/forms/d/e/1FAIpQLSfCydoEWNJjtxstg_XHJaUe6zawSj0j7lCsmt-wJNRx_4fjWg/viewform' },
    { month: 'November', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdIvsl02sIgDhOiZBDKh5G6nvVEzj7MtSOEt4Af2wST2iCL6w/viewform' },
    { month: 'December', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeHYNgBn2g-lEckglN1ZfwUQxcOPd9oPOyVBuDwD2CpE8lKYQ/viewform' },
  ];

  const hhaTrainings = [
    { month: 'January', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdJAMhgbDS-El-TPlmnnEZ0A-gY-GYOj-jUwwCvfZbbCuznDQ/viewform' },
    { month: 'February', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeBB2NNupxYOhA0kdeRmrHTdV1LB4yReKZDm9Kp7xT8_1OnRg/viewform' },
    { month: 'March', link: 'https://docs.google.com/forms/d/e/1FAIpQLSepHT-ISIlaXJdc18AGdBq8j7qbgPW4z4IbTXYg8ebNch5XkA/viewform' },
    { month: 'April', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeGmszf2S5pml8uqcPCg6GbsddynFYzN4_ZwnrblCcv4Nsmig/viewform' },
    { month: 'May', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdz-zqN3YEJFpi0tpIRHzVO2XgMyABYs8Jw_SwOzwXTFaJTAg/viewform' },
    { month: 'June', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdisjJ5E20RbKPH2qIrXs7j6MnhM2Po-huEQGrMqxtYCr404g/viewform' },
    { month: 'July', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdxyZh2LKWfBULQo9GaV_o3WeWk893OtpO3qzZ9ETQiWOfwnA/viewform' },
    { month: 'August', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdTeBKPyavodni3W67NTs9LWEGH2fmKbjTfWb06d8-zSNO8iQ/viewform' },
    { month: 'September', link: 'https://docs.google.com/forms/d/e/1FAIpQLSfQx3gVeNp0uf-3p91BVH9PAEmGzj08PqovM-_7jmvyDFOgbQ/viewform' },
    { month: 'October', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdMOXr64na13-CQbwNHeJnHlJ3mN4FUVatKWGiy2SrJNVhz4A/viewform' },
    { month: 'November', link: 'https://docs.google.com/forms/d/e/1FAIpQLSe9yMd84lLhXvWRPoeIRa63MoRNoJ5X8EsQniJvR14jzy4gwQ/viewform?usp=send_form' },
    { month: 'December', link: 'https://docs.google.com/forms/d/e/1FAIpQLScU5-T8jpV72zN4lR7TPIcQcw2g6krONg5mn94fesGfaAcxdA/viewform' },
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
                            variant="outline-secondary" 
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
                <Button variant="success" href="#cpr-training" className="special-button me-3">CPR Training</Button>
                <Button variant="warning" href="#mental-health-quiz" className="special-button">Mental Health Quiz</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
