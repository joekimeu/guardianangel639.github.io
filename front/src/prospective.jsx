import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { DarkModeContext } from './DarkModeContext';
import './prospective.css'; // Updated CSS file for hero module
import slideshowImg1 from './docs/Images/n-old-bcouple-2.jpeg';
import slideshowImg2 from './docs/Images/wn-whiteman.jpg';
import slideshowImg3 from './docs/Images/bn-oldman.webp';
import slideshowImg4 from './docs/Images/bd-whiteman.jpg';
import slideshowImg5 from './docs/Images/bm-whitewoman.jpeg';
import slideshowImg6 from './docs/Images/ww-whitewoman.jpg';

export default function Prospective() {
  const { darkMode } = useContext(DarkModeContext);

  const slideshowImages = [
    slideshowImg1,
    slideshowImg2,
    slideshowImg3,
    slideshowImg4,
    slideshowImg5,
    slideshowImg6
  ];


  return (
    <div className={`prospective-hero ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Hero Section with Slideshow */}
      <section className="hero-slideshow">
        <Carousel>
          {slideshowImages.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 slideshow-image"
                src={image}
                alt={`Slide ${index + 1}`}
              />
              <Carousel.Caption>
                <h2 className="slideshow-title">Join Guardian Angel Health Agency</h2>
                <p className="slideshow-subtitle">Where Passion Meets Purpose</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* Benefits Section */}
      <section className={`benefits-section ${darkMode ? 'dark-benefits' : 'light-benefits'}`}>
        <Container>
          <Row className="justify-content-center" >
            {[
              {
                title: 'Commitment to Positive Patient Outcomes',
                description: 'We work with patients to provide care of the utmost quality.',
              },
              {
                title: 'Experienced Medical Professionals',
                description: 'We host nursing staff with 20+ years of experience.',
              },
              {
                title: 'Competitive Pay & Flexible Hours',
                description: 'We offer great pay and flexible hours that fit into your schedule.',
              },
              {
                title: 'Start as Soon as You Are Available',
                description: 'We offer a quick and comprehensive onboarding and training process.',
              },
              {
                title: 'Exceptional Home Health Care',
                description: 'We improve Ohio by prioritizing patients, promoting employee well-being, and giving back.',
              },
            ].map((benefit, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="benefit-card">
                  <Card.Body>
                    <h2 className="benefit-title">{benefit.title}</h2>
                    <p className="benefit-description">{benefit.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button
              variant="success"
              href="https://forms.office.com/r/aEK2f7yhA1"
              className="apply-button"
            >
              Apply Now!
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
