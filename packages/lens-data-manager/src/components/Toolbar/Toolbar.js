import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

export const Toolbar = () => {
  return (
    <Navbar>
      <Nav>
        <Navbar.Brand>
          <a href='#'>InferenceLensGM</a>
        </Navbar.Brand>
        <IndexLinkContainer to='/'>
          <NavItem>Home</NavItem>
        </IndexLinkContainer>
        <LinkContainer to='/catalog'>
          <NavItem>Catalog</NavItem>
        </LinkContainer>
        <LinkContainer to='/about'>
          <NavItem>About</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar>
  );
};

//  <LinkContainer to='/counter'>
//    <NavItem>Counter</NavItem>
//  </LinkContainer>

export default Toolbar;
