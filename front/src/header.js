import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { AuthContext } from './context/AuthProvider';
import { jwtDecode } from 'jwt-decode';
import { FaSun, FaMoon } from 'react-icons/fa';
import './header.css';
import './global.css';
import { DarkModeContext } from './DarkModeContext';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [role, setRole] = useState('guest'); // Default role as 'guest'
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  let [username, setUsername] = useState('null');
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', darkMode);
    document.body.classList.toggle('light-theme', !darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
    setShowMenu(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleLinkClick = (path) => {
    setShowMenu(false);
    navigate(path);
  };



  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        username = decodedToken.username;
        setUsername(username)
        // Assign roles based on username
        if (['annemulama', 'joekimeu'].includes(username)) {
          setRole('admin');
        } else if (['tracynungo', 'doraboamoah', 'loradickerson'].includes(username)) {
          setRole('employee');
        } else if (['gahaemployee', 'gahanurse', 'gahahha'].includes(username)) {
          setRole('staff');
        } else {
          setRole('guest');
        }
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }, [auth]);

  // Role-based menu configuration
  const menuConfig = {
    admin: [
      { label: 'Leadership', path: '/operatingcommittee' },
      { label: 'Prospective', path: '/prospective' },
      { label: 'Contact', path: '/contact' },
      { label: 'Profile', path: `/read/${username}` },
      { label: 'Punchcard', path: '/clockinout' },
      { label: 'All Users', path: '/allUsers' },
      { label: 'Make New User', path: '/create' },
      { label: 'Trainings', path: '/trainings' },
    ],
    employee: [
      { label: 'Leadership', path: '/operatingcommittee' },
      { label: 'Prospective', path: '/prospective' },
      { label: 'Contact', path: '/contact' },
      { label: 'Profile', path: `/read/${username}` },
      { label: 'Punchcard', path: '/clockinout' },
      { label: 'Trainings', path: '/trainings' },
    ],
    staff: [
      { label: 'Leadership', path: '/operatingcommittee' },
      { label: 'Prospective', path: '/prospective' },
      { label: 'Contact', path: '/contact' },
      { label: 'Trainings', path: '/trainings' },
    ],
    guest: [
      { label: 'Leadership', path: '/operatingcommittee' },
      { label: 'Prospective', path: '/prospective' },
      { label: 'Contact', path: '/contact' },
      { label: 'Sign In', path: '/signin'}
    ],
  };

  // Determine the menu items to display based on the user's role
  const menuItems = menuConfig[role] || menuConfig.guest;

  return (
    <>
      <Navbar
       bg={darkMode ? 'dark' : 'light'}
        expand="lg"
        className={`fixed-top custom-navbar ${darkMode ? 'navbar-dark' : 'navbar-light'}`}
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Navbar.Brand href="/" className={`brand-title ${darkMode ? 'brand-title-light' : 'brand-title-dark'}`}>
            Guardian Angel Health Agency LLC
          </Navbar.Brand>
          <div className="d-flex align-items-center header-icons">
            <Button
              variant={`${darkMode ? 'custom-button-dark' : 'custom-button-light'}`}
              onClick={toggleDarkMode}
              className={`me-3 custom-button ${darkMode ? 'custom-button-dark' : 'custom-button-light'}`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>
            <Button
              variant={`${darkMode ? 'custom-button-dark' : 'custom-button-light'}`}
              onClick={handleMenuToggle}
              className={`custom-button ${darkMode ? 'custom-button-dark' : 'custom-button-light'}`}
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
        className={`${darkMode ? 'offcanvas-dark' : 'offcanvas-light'}`}
      >
        <Offcanvas.Header closeButton className={darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}>
          <Offcanvas.Title className="offcanvas-title">Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={`${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'} align-left`}>
          <Nav className="flex-column">
            {menuItems.map((item, index) => (
              <Nav.Link
                key={index}
                onClick={() => handleLinkClick(item.path)}
                className="menu-option-item"
              >
                {item.label}
              </Nav.Link>
            ))}
            {auth.token && (
              <Nav.Link onClick={handleLogout} className="menu-option-item">
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

