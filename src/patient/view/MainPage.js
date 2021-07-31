import React  from "react";
import {
  Container,
  Row,
  Image,
} from "react-bootstrap";
import Main from "./../assets/Main.png";

const MainPage = ({history}) => {
 

  return (
    <Container fluid>
      <Row className='main-container'>
        <Image src={Main}
      ></Image>
      </Row>
    </Container>
  );
};

export default MainPage;  