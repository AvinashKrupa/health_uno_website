import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Row, Col, Image } from "react-bootstrap";
import {arrowRight} from "../constants/PatientImages";
import React,{ useState,useEffect }  from "react";

const CarouselComponent = ({sliders}) => {
    const [size, setSize] = useState({
        x: window.innerWidth-200,
        y: window.innerHeight
    });
    const updateSize = () =>
        setSize({
            x: window.innerWidth-200,
            y: window.innerHeight
        });
    useEffect(() => (window.onresize = updateSize), []);

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
                        width:(size.x/1200 * 1200),
                        height:(size.x/300 * 300)/4
                    }}
                    fluid

                />
            }
            {
                size.x <500 && <Image
                    src={slider.mob_image}
                    alt="carousel_image_1"
                    style={{
                        width:(size.x/1200 * 1200),
                        height:(size.x/600 * 600)/2
                    }}
                    fluid

                />
            }
            </div>
        </Col>
    )
  }
  const renderImageWithTitleSlider = (slider) => {
    return(
        <>
          <Col lg="3">
            <Image
                src={slider.image}
                alt="carousel_image_1"
                className="carousel_image"
                style={{ marginLeft: "80px",  width: "100%" }}
            />
          </Col>
          <Col lg="9">
            <Row>
              <span
                  className="carousel_h3"
                  style={{
                    marginBottom: "50px",
                    marginTop: "40px",
                    paddingLeft: "130px",
                  }}
              >
                {slider.title}
              </span>
            </Row>
            <Row>
              <span
                  className="carousel_h5"
                  style={{ paddingLeft: "130px" }}
              >
                {slider.desc}
              </span>
            </Row>
          </Col>
        </>
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

            {sliders.map((slider) => {
              return(
                <div className="carousel_container">
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
