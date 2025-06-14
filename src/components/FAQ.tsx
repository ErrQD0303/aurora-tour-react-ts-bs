import { useMemo, type ComponentProps } from "react";
import { Accordion, Container } from "react-bootstrap";

type Props = ComponentProps<"section"> & {};

type FAQItem = {
  question: string;
  answer: string;
};

function FAQ(props: Props) {
  const faqItems: FAQItem[] = useMemo(
    () => [
      {
        question: "How long are the trips?",
        answer:
          "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus, labore!",
      },
      {
        question: "Is the flight included?",
        answer:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, magnam?",
      },
      {
        question: "Can I cancel after booking?",
        answer:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum, totam.",
      },
    ],
    []
  );

  return (
    <section className="py-md-5" {...props}>
      <h2 className="my-5 text-center">FAQ</h2>

      <Container>
        <Accordion
          id="questionAccordion"
          defaultActiveKey={"0"}
          className="mx-auto w-75"
        >
          {faqItems.map(({ question, answer }, index) => (
            <Accordion.Item key={index} eventKey={String(index)}>
              <Accordion.Header>{question}</Accordion.Header>
              <Accordion.Body>{answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}

export default FAQ;
