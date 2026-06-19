import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart, decreaseQty, deleteProduct } from "../app/features/cart/cartSlice";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./cart.css";

const Cart = () => {
  const { cartList } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const subtotal      = cartList.reduce((s, i) => s + i.qty * i.price, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const finalTotal    = subtotal + deliveryCharge;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleCheckout = () => {
    if (!user)               { toast.error("Please login to proceed!"); navigate("/login"); return; }
    if (cartList.length === 0) { toast.error("Your cart is empty!");   return; }
    navigate("/checkout");
  };

  return (
    <section className="cart-items">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            {cartList.length === 0 && (
              <div className="empty-cart">
                <div style={{ fontSize: "72px" }}>🛒</div>
                <h2>Your cart is empty!</h2>
                <p>Looks like you haven't added anything yet.</p>
                <button className="shop-now-btn" onClick={() => navigate("/shop")}>🛍️ Start Shopping</button>
              </div>
            )}
            {cartList.map((item) => {
              const lineTotal = item.price * item.qty;
              return (
                <div className="cart-list" key={item.id}>
                  <Row>
                    <Col className="image-holder" sm={4} md={3}>
                      <img src={item.imgUrl} alt={item.productName} />
                    </Col>
                    <Col sm={8} md={9}>
                      <Row className="cart-content justify-content-center">
                        <Col xs={12} sm={9} className="cart-details">
                          <h3>{item.productName}</h3>
                          <h4>₹{Number(item.price).toLocaleString("en-IN")} × {item.qty}
                            <span>₹{lineTotal.toLocaleString("en-IN")}</span>
                          </h4>
                        </Col>
                        <Col xs={12} sm={3} className="cartControl">
                          <button className="incCart" onClick={() => dispatch(addToCart({ product: item, num: 1 }))}><i className="fa-solid fa-plus"></i></button>
                          <button className="desCart" onClick={() => dispatch(decreaseQty(item))}><i className="fa-solid fa-minus"></i></button>
                        </Col>
                      </Row>
                    </Col>
                    <button className="delete" onClick={() => dispatch(deleteProduct(item))}><ion-icon name="close"></ion-icon></button>
                  </Row>
                </div>
              );
            })}
          </Col>

          <Col md={4}>
            <div className="cart-total">
              <h2>Order Summary</h2>
              <div className="d_flex"><h4>Items ({cartList.length}):</h4><h3>₹{subtotal.toLocaleString("en-IN")}</h3></div>
              <div className="d_flex" style={{ borderBottom: "1px dashed #eee", paddingBottom: "10px", marginBottom: "10px" }}>
                <h4>Delivery:</h4>
                <h3 style={{ color: deliveryCharge === 0 ? "green" : "#e94560" }}>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</h3>
              </div>
              <div className="d_flex" style={{ marginBottom: "20px" }}>
                <h4><strong>Estimated Total:</strong></h4>
                <h3><strong>₹{finalTotal.toLocaleString("en-IN")}</strong></h3>
              </div>
              {cartList.length > 0 && (
                <div className="payment-section">
                  <button className="checkout-proceed-btn" onClick={handleCheckout}>
                    Proceed to Checkout →
                  </button>
                  <p className="secure-text">🔐 256-bit SSL Encrypted · Secure Checkout</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Cart;
