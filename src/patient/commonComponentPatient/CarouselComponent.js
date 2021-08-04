import "./carousel.scss";
import { Carousel } from "react-responsive-carousel";
import { Image } from "react-bootstrap";
const CarouselComponent = (props) => {
  const images = props;
  return (
    <>
      <Carousel>
        <div>
          <Image src={value} />
        </div>
      </Carousel>
    </>
  );
};

export default CarouselComponent;