import { type ComponentPropsWithoutRef } from "react";
import { Form } from "react-bootstrap";
import type { BookingFormTourSelectOption } from "@components/BookingModal";

type FloatingInputProps = ComponentPropsWithoutRef<typeof Form.Control> & {};

export function FloatingControl(props: FloatingInputProps) {
  const { ...rest } = props;

  return (
    <Form.Floating>
      <Form.Control {...rest} />
      <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
    </Form.Floating>
  );
}

type FloatingSelectProps = ComponentPropsWithoutRef<typeof Form.Select> & {
  options: Array<BookingFormTourSelectOption>;
};

export function FloatingSelect(props: FloatingSelectProps) {
  const { options, ...rest } = props;

  return (
    <Form.Floating>
      <Form.Select defaultValue="" {...rest}>
        {options.map(({ value, label, ...rest }) => (
          <option key={value} value={value} {...rest}>
            {label}
          </option>
        ))}
      </Form.Select>
      <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
    </Form.Floating>
  );
}
