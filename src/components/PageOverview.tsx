import { type ComponentProps } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/components/PageOverview.scss";

type Props = ComponentProps<"section"> & {};

function PageOverview(props: Props) {
  const { ...rest } = props;

  return (
    <section {...rest}>
      <Container className="h-100 d-flex align-items-center">
        <Row className="w-100 text-center fs-4">
          <Col xl>
            <i className="bi bi-airplane-fill me-2"></i>
            <span>3 Amazing Destinations</span>
          </Col>
          <Col xl>
            <i className="bi bi-wallet-fill me-2"></i>
            <span>Only pay 5% up front</span>
          </Col>
          <Col xl>
            <i className="bi bi-patch-check-fill me-2"></i>
            <span>1000's of customers</span>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default PageOverview;
