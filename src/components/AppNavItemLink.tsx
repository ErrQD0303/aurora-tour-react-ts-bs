import React from "react";
import { Nav } from "react-bootstrap";

type Props = React.ComponentProps<typeof Nav.Link>;

function AppNavItemLink(props: Props) {
  return (
    <li className="nav-item">
      <Nav.Link {...props}>{props.children}</Nav.Link>
    </li>
  );
}

export default AppNavItemLink;
