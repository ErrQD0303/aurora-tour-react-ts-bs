import { useMemo, type ComponentProps, type FormEventHandler } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FloatingSelect, FloatingControl } from "./FloatingFields";

export type BookingFormTourSelectOption = {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
};

type BookingModalUIProps = Props & {};

const BookingModalUI = (props: BookingModalUIProps) => {
  const select1Options = useMemo(
    () => [
      { value: "", label: "Select a tour", disabled: true },
      { value: "Norway", label: "Tromso, Norway - $899" },
      { value: "Iceland", label: "Reykjavik, Iceland - $799" },
      { value: "Canada", label: "Yukon, Canada - $849" },
    ],
    []
  );

  const { handleFormSubmit, ...rest } = props;

  return (
    <Modal className="fade" tabIndex="-1" {...rest}>
      <Modal.Header closeButton>
        <Modal.Title as="h5">Book a tour</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="booking-form" onSubmit={handleFormSubmit}>
          <Row className="g-2">
            <Col sm="6">
              <Form.Floating>
                <FloatingControl
                  id="email1"
                  type="email"
                  label="Email Address"
                  placeholder="Your email"
                />
              </Form.Floating>
            </Col>
            <Col sm="6">
              <FloatingSelect
                id="select1"
                label="Tour selection"
                options={select1Options}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button type="submit" variant="primary" form="booking-form">
          Checkout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

type Props = ComponentProps<typeof Modal> & {
  handleFormSubmit?: FormEventHandler<HTMLFormElement>;
};

function BookingModal(props: Props) {
  const [handleFormSubmit] = useMemo(() => {
    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // You can add your form submission logic here
      window.history.pushState({}, "", "#");
    };

    return [handleFormSubmit];
  }, []);

  return <BookingModalUI handleFormSubmit={handleFormSubmit} {...props} />;
}

export default BookingModal;
