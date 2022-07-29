import React from "react";
import logo from "./Picture1.png";
import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";

const NavbarComponent = () => {
  return (
    <Navbar bg="success">
      <Container className="justify-content-between align-items-center">
        <Navbar.Brand href="#home">
          <img
            src={logo}
            width="168"
            height="50"
            className="d-inline-block align-top"
            alt="Sprinklr logo"
          />
        </Navbar.Brand>

        <div style={{ fontWeight: "bold" }}>API Failure Platform</div>
        <div style={{ color: "rgba(0, 0, 0, 0)" }}>
          API Failure Platform test
          {/* Included to ensure the text is centered */}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
