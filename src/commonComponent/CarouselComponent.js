import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Row, Col, Image } from "react-bootstrap";
import {arrowRight} from "../constants/PatientImages";
import React,{ useState,useEffect }  from "react";

const CarouselComponent = ({sliders}) => {
    const [size, setSize] = useState({
        x: window.innerWidth-40,
        y: window.innerHeight
    });
    const updateSize = () =>
        setSize({
            x: window.innerWidth-40,
            y: window.innerHeight
        });
    useEffect(() => (window.onresize = updateSize), []); // eslint-disable-line react-hooks/exhaustive-deps

    const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const CustomeRightArrow = ({ onClick, ...rest }) => {
    return (
      <button
        className="react-multiple-carousel__arrow react-multiple-carousel__arrow---right"
        onClick={() => onClick()}
      >
        <Image src={arrowRight} />
      </button>
    );
  };

  const renderFullImageSlider = (slider) => {
    return(
        <Col lg="12" md="12" sm="12" xs="12">
            <div>
            {
                size.x >500 && <Image
                    src={slider.image}
                    alt="carousel_image_1"
                    style={{
                        width:size.x,
                        height:size.x/4.5
                    }}
                    fluid

                />
            }
            {
                size.x <500 && <Image
                    src={slider.mob_image}
                    alt="carousel_image_1"
                    style={{
                        width:(size.x),
                        height:(size.x)/2
                    }}
                    fluid

                />
            }
            </div>
        </Col>
    )
  }

  return (
    <>
      <Row>
          <Col lg="12" md="12" sm="12" xs="12" className="carouselMainContainer">
          <Carousel
            autoPlay={true}
            customLeftArrow={<></>}
            customRightArrow={<CustomeRightArrow />}
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            containerClass='react-multi-carousel-list'
          >

            {sliders.map((slider, key) => {
              return(
                <div key={key} className="carousel_container">
                <Row className='g-0'>
                    {renderFullImageSlider(slider)}
                  {/*{*/}
                  {/*  slider.desc==='' && renderFullImageSlider(slider)*/}
                  {/*}*/}
                  {/*{*/}
                  {/*  slider.desc!=='' && renderImageWithTitleSlider(slider)*/}
                  {/*}*/}
                </Row>
              </div>
              )
            })}
          </Carousel>
        </Col>
      </Row>
    </>
  );
};

export default CarouselComponent;
