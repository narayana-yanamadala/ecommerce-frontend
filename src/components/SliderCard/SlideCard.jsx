import { Col, Container, Row } from "react-bootstrap";
import "./slidercard.css";
import { useNavigate } from "react-router-dom";

const SlideCard = ({ title, desc, cover }) => {
  const navigate = useNavigate();
  return (
    <Container className="box">
      <Row className="align-items-center">
        <Col md={6}>
          <p className="slide-tag">🔥 Limited Time Offer</p>
          <h1>{title}</h1>
          <p className="slide-desc">{desc}</p>
          <div className="slide-btns">
            <button className="btn-primary" onClick={() => navigate("/shop")}>
              Shop Now →
            </button>
            <button className="btn-outline" onClick={() => navigate("/shop")}>
              View Deals
            </button>
          </div>
        </Col>
        <Col md={6}>
          <img src={cover} alt={title} />
        </Col>
      </Row>
    </Container>
  );
};

export default SlideCard;
