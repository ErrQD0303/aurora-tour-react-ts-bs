import { Navbar, Container, Nav } from "react-bootstrap";
import AppNavItemLink from "./AppNavItemLink";
import { useMemo } from "react";

function AppNavbar() {
  const activeLink = useMemo(() => {
    // Change it later to get the current path
    return "#" + "";
  }, []);

  return (
    <Navbar expand="sm" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" className="text-uppercase">
          AuroraTour
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarNav"
          aria-label="Toggle navigation"
        />
        <Navbar.Collapse id="navbarNav">
          <Nav as="ul" className="ms-auto">
            <AppNavItemLink
              href="/#packages"
              active={activeLink === "#packages"}
            >
              Packages
            </AppNavItemLink>
            <AppNavItemLink href="/#faq" active={activeLink === "#faq"}>
              FAQ
            </AppNavItemLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
