import { Card, type CardProps } from "react-bootstrap";
import "@componentStyles/TourCard.scss";

type Props = CardProps & {
  onBookingButtonClick?: () => void;
  cardImgTopSrc?: string;
  cardImgTopAlt?: string;
  cardTitle?: string;
  cardText?: string;
};

function TourCard({
  onBookingButtonClick,
  cardImgTopSrc,
  cardImgTopAlt,
  cardTitle,
  cardText,
  ...props
}: Props) {
  return (
    <Card {...props}>
      <Card.Img variant="top" src={cardImgTopSrc} alt={cardImgTopAlt} />
      <Card.Body>
        <Card.Title as="h5">{cardTitle}</Card.Title>
        <Card.Text>{cardText}</Card.Text>
        {onBookingButtonClick && (
          <button className="btn btn-primary" onClick={onBookingButtonClick}>
            Book tour
          </button>
        )}
      </Card.Body>
    </Card>
  );
}

export default TourCard;
