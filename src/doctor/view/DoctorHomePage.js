import React  from "react";
import {
  Container,
  Row,
  Image,
} from "react-bootstrap";
import Main from "../assets/Main.png";

const DoctorHomePage = () => {
 

  return (
    <Container fluid>
      <Row className='main-container'>
        <Image alt="container" src={Main}
      ></Image>
      </Row>
    </Container>
  );
};

export default DoctorHomePage; 
