import { Col, Container, Row, type ContainerProps } from "react-bootstrap";
import type { Tour } from "@components/Packages";
import TourCard from "@components/TourCard";

type Props = ContainerProps & {
  onBookingButtonClick?: () => void;
  tours?: Tour[];
};

function TourCardList({ tours = [], onBookingButtonClick, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Row className="row-gap-5">
        {tours.map(({ id, currency, description, image, place, price }) => (
          <Col key={id} lg>
            <TourCard
              cardImgTopSrc={image}
              cardImgTopAlt={place.replace(", ", "-")}
              cardTitle={`${place} - ${currency}${price}`}
              cardText={description}
              onBookingButtonClick={onBookingButtonClick}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TourCardList;
