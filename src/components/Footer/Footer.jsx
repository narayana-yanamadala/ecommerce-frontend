import React from "react";
import "./style.css";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className="footer-row">
          <Col md={3} sm={5} className="box">
            <div className="logo">
              <ion-icon name="bag"></ion-icon>
              <h1>Multimart</h1>
            </div>
            <p>India's trusted online marketplace for electronics, fashion, furniture & more. Shop smarter, save bigger — every single day!</p>
            <div className="footer-social">
              <ion-icon name="logo-instagram"></ion-icon>
              <ion-icon name="logo-facebook"></ion-icon>
              <ion-icon name="logo-twitter"></ion-icon>
              <ion-icon name="logo-youtube"></ion-icon>
            </div>
          </Col>
          <Col md={3} sm={5} className="box">
            <h2>About Us</h2>
            <ul>
              <li>Careers at Multimart</li>
              <li>Our Stores Across India</li>
              <li>Seller Partnership</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </Col>
          <Col md={3} sm={5} className="box">
            <h2>Customer Care</h2>
            <ul>
              <li>Help Center</li>
              <li>How to Place an Order</li>
              <li>Track Your Order</li>
              <li>Returns & Refunds</li>
              <li>Bulk / Corporate Orders</li>
            </ul>
          </Col>
          <Col md={3} sm={5} className="box">
            <h2>Contact Us</h2>
            <ul>
              <li>📍 Hyderabad, Telangana, India</li>
              <li>📧 support@multimart.in</li>
              <li>📞 +91 8688012658</li>
              <li>⏰ Mon–Sat: 9AM – 6PM IST</li>
            </ul>
            <div className="footer-payment">
              <span>We Accept:</span>
              <div className="pay-icons">
                <span>UPI</span>
                <span>Razorpay</span>
                <span>PhonePe</span>
              </div>
            </div>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p>© 2024 Multimart. Made with ❤️ in India. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
