import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function NavigationBar() {
  return (
    <Navbar variant="light" expand="lg" style={{backgroundColor:'#9ec8d6', minHeight:'50px'}}>
    <Navbar.Toggle style={{marginRight:'10px'}} aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto" style={{marginLeft:'10px'}}>
        <Nav.Link as={Link} to="/">Things</Nav.Link>
        <Nav.Link as={Link} to="Services">Services</Nav.Link>
        <Nav.Link as={Link} to="Relationships">Relationships</Nav.Link>
        <Nav.Link as={Link} to="Apps">Apps</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;
