import { Carousel, Button } from "react-bootstrap";
import carouselSlide1 from "@assets/images/carousel-1.jpg";
import carouselSlide2 from "@assets/images/carousel-2.jpg";
import carouselSlide3 from "@assets/images/carousel-3.jpg";
import "@componentStyles/HeroCarousel.scss";
import { useMemo, type ComponentProps } from "react";

export type HeroCarouselItem = {
  id: string | number;
  image: string;
  caption: {
    title: string;
    text: string;
  };
};

type HeroCarouselUIProps = Props & {};

const HeroCarouselUI = (props: HeroCarouselUIProps) => {
  const carouselItems: Array<HeroCarouselItem> = useMemo(() => {
    return [
      {
        id: 1,
        image: carouselSlide1,
        caption: {
          title: "The Aurora Tour",
          text: "Discover the hidden world",
        },
      },
      {
        id: 2,
        image: carouselSlide2,
        caption: {
          title: "The season has arrived",
          text: "3 Available Tours",
        },
      },
      {
        id: 3,
        image: carouselSlide3,
        caption: {
          title: "Destination activities",
          text: "Go glacier hiking",
        },
      },
    ];
  }, []);

  const { onBookingButtonClick, ...rest } = props;

  return (
    <Carousel interval={3000} pause="hover" controls indicators slide {...rest}>
      {carouselItems.map(({ image, caption: { title, text }, id }) => (
        <Carousel.Item className="c-item" key={id}>
          <img
            src={image}
            className="d-block w-100 c-img"
            alt={`Hero Carousel Slide ${id}`}
          />
          <Carousel.Caption className="top-0 mt-4">
            <h3 className="fs-3 mt-5">{text}</h3>
            <p className="display-1 fw-bolder text-capitalize">{title}</p>
            <Button
              variant="primary"
              className="px-4 py-2"
              onClick={onBookingButtonClick}
            >
              Book a tour
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

type Props = ComponentProps<typeof Carousel> & {
  onBookingButtonClick?: () => void;
};

function HeroCarousel(props: Props) {
  return <HeroCarouselUI {...props} />;
}

export default HeroCarousel;
