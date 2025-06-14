import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark py-5 mt-5">
      <Container className="text-center text-light">
        <p className="display-5 mb-3">AuroraTours</p>
        <small className="text-white-50">
          &copy; 2025 AuroraTours. All rights by
          <strong>Nguyen Quoc Dat</strong>
        </small>
      </Container>
    </footer>
  );
}

export default AppFooter;
