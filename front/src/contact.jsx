import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import emailjs from 'emailjs-com';
import { DarkModeContext } from './DarkModeContext';
import './global.css';
import './contact.css'; // New CSS file for additional styling

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const { darkMode } = useContext(DarkModeContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      'service_8s8jltp', // Replace with your EmailJS service ID
      'template_dp8mqgr', // Replace with your EmailJS template ID
      formData,
      'tyyCV9g6FoxoNQZ0s'
    ).then((result) => {
      alert('Message sent successfully!');
    }, (error) => {
      alert('An error occurred, please try again.');
    });

    setFormData({ fullName: '', email: '', message: '' });
  };

  return (
    <div className={`contact-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Container className="text-center mt-5">
        <h1 className="page-title">Contact Us</h1>
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <Card className="contact-card shadow-lg mb-5">
              <Card.Body>
                <Card.Text className="contact-info">
                  <strong>Address:</strong><br />
                  639 S. Hamilton Road, Whitehall, Ohio 43213
                </Card.Text>
                <Card.Text className="contact-info">
                  <strong>Email:</strong><br />
                  <a href="mailto:office.manager@guardianangelha.com" className="contact-link">office.manager@guardianangelha.com</a>
                </Card.Text>
                <Card.Text className="contact-info">
                  <strong>Numbers:</strong><br />
                  Phone: (614) 868-3225 or (614) 717-8151 <br />
                  Fax: (614) 868-3437
                </Card.Text>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter your full name" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter your email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Enter your message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="success" type="submit" className="send-button">
                      Send Message
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
