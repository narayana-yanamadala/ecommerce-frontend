import { Col, Container, Row } from "react-bootstrap";
import "./banner.css";

const Banner = ({ title }) => {
  return (
    <div className="image-container">
      <img
        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"
        alt="banner"
      />
      <div className="overlay">
        <Container>
          <Row>
            <Col>
              <h2>{title}</h2>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Banner;
