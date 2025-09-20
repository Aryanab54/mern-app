import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <BootstrapNavbar bg="white" variant="light" expand="lg" className="shadow-sm border-bottom">
      <Container>
        <BootstrapNavbar.Brand href="/dashboard" className="fw-bold text-primary">
          <i className="fas fa-chart-line me-2"></i>
          MERN Admin
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle />
        <BootstrapNavbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link 
              href="/dashboard" 
              className={`fw-semibold ${location.pathname === '/dashboard' ? 'text-primary' : ''}`}
            >
              <i className="fas fa-tachometer-alt me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link 
              href="/agents"
              className={`fw-semibold ${location.pathname === '/agents' ? 'text-primary' : ''}`}
            >
              <i className="fas fa-users me-1"></i>
              Agents
            </Nav.Link>
            <Nav.Link 
              href="/upload"
              className={`fw-semibold ${location.pathname === '/upload' ? 'text-primary' : ''}`}
            >
              <i className="fas fa-upload me-1"></i>
              Upload
            </Nav.Link>
            <Nav.Link 
              href="/distribution"
              className={`fw-semibold ${location.pathname === '/distribution' ? 'text-primary' : ''}`}
            >
              <i className="fas fa-list-alt me-1"></i>
              Distribution
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-primary" className="border-0">
                <i className="fas fa-user-circle me-2"></i>
                {user.email}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;