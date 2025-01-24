import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { AuthContext } from './context/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import { FaSun, FaMoon } from 'react-icons/fa';
import './header.css';
import './global.css';
import { DarkModeContext } from './DarkModeContext';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    // Apply a class to the body based on the theme
    document.body.classList.toggle('dark-theme', darkMode);
    document.body.classList.toggle('light-theme', !darkMode);
  }, [darkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowMenu(false); // Close menu after search
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
    setShowMenu(false); // Close menu on logout
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLinkClick = (path) => {
    setShowMenu(false); // Close menu on link click
    navigate(path);
  };

  let employeeUsername = null;
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      employeeUsername = decodedToken.username;
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
  }

  return (
    <>
      <Navbar
        bg={darkMode ? 'dark' : 'light'}
        className={`mb-3 ${darkMode ? 'navbar-dark' : 'navbar-light'} fixed-top`}
        expand="lg"
        style={{ zIndex: 1050, width: '100%' }}
      >
        <Container fluid>
         <Navbar.Brand href="/" style={{ fontSize: '2rem', color: darkMode ? '#ffffff' : '#000000' }}>
            <span className="d-none d-lg-inline">Guardian Angel Health Agency LLC</span>
            <span className="d-inline d-lg-none">GAHA LLC</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-success"
              onClick={toggleDarkMode}
              className="me-2 custom-button"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>
            <Button
              variant="outline-success"
              onClick={handleMenuToggle}
              className="custom-button"
            >
              Menu
            </Button>
          </div>
        </Container>
      </Navbar>

      <Offcanvas
        show={showMenu}
        onHide={handleMenuToggle}
        placement="end"
        style={{ width: '100%', maxWidth: '100%' }}
        className={darkMode ? 'offcanvas-close-dark' : 'offcanvas-close-light'}
      >
        <Offcanvas.Header closeButton className={darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={`${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'} align-left`}>
          <Nav className="flex-column menu-options align-left">
            <Nav.Link onClick={() => handleLinkClick('/operatingcommittee')} className="menu-option-item">Leadership</Nav.Link>
            <Nav.Link onClick={() => handleLinkClick('/prospective')} className="menu-option-item">Prospective</Nav.Link>
            <Nav.Link onClick={() => handleLinkClick('/contact')} className="menu-option-item">Contact</Nav.Link>
            {auth.token ? (
              <>
                {employeeUsername !== "gahaemployee" && (
                  <>
                    <Nav.Link onClick={() => handleLinkClick(`/edit/${employeeUsername}`)} className="menu-option-item">Profile</Nav.Link>
                    <Nav.Link onClick={() => handleLinkClick('/clockinout')} className="menu-option-item">Punchcard</Nav.Link>
                  </>
                )}
                {employeeUsername === "annemulama" && (
                  <NavDropdown title="Admin Options" className={`${darkMode ? 'text-white' : 'text-dark'} menu-option-item`}>
                    <NavDropdown.Item onClick={() => handleLinkClick('/home')}>All Users</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleLinkClick('/create')}>Make New User</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => handleLinkClick('/trainings')}>Trainings</NavDropdown.Item>
                  </NavDropdown>
                )}
                {employeeUsername === "gahaemployee" && (
                  <Nav.Link onClick={() => handleLinkClick('/trainings')} className="menu-option-item">Trainings</Nav.Link>
                )}
                <Nav.Link onClick={handleLogout} className="menu-option-item">Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={() => handleLinkClick('/signin')} className="menu-option-item">Sign In</Nav.Link>
            )}
          </Nav>
          <Form className="search-form" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
