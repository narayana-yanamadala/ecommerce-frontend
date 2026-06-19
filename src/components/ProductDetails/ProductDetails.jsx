import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../app/features/cart/cartSlice";
import "./product-details.css";

const Stars = ({ rating = 4 }) => (
  <span>
    {[1,2,3,4,5].map(i => (
      <i key={i} className={`fa fa-star${i <= Math.floor(rating) ? "" : (i - rating < 1 ? "-half-o" : "-o")}`} style={{ color: "#f59e0b" }}></i>
    ))}
    <span style={{ fontSize: "13px", color: "#888", marginLeft: "6px" }}>({rating})</span>
  </span>
);

const ProductDetails = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return null;

  const price    = Number(selectedProduct.price) || 0;
  const discount = Number(selectedProduct.discount) || 0;
  const oldPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : null;

  const handleAdd = () => {
    dispatch(addToCart({ product: selectedProduct, num: Number(quantity) }));
    toast.success(`"${selectedProduct.productName}" added to cart! 🛒`);
  };

  return (
    <section className="product-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="product-img-wrap">
              <img loading="lazy" src={selectedProduct.imgUrl} alt={selectedProduct.productName} />
              {discount > 0 && <span className="prod-discount-badge">{discount}% OFF</span>}
            </div>
          </Col>
          <Col md={6}>
            <div className="product-info">
              <p className="prod-category">{selectedProduct.category?.toUpperCase()}</p>
              <h2>{selectedProduct.productName}</h2>

              <div className="rate">
                <Stars rating={Number(selectedProduct.avgRating) || 4} />
              </div>

              <div className="price-row">
                <span className="prod-price">₹{price.toLocaleString("en-IN")}</span>
                {oldPrice && <span className="prod-old-price">₹{oldPrice.toLocaleString("en-IN")}</span>}
                {discount > 0 && <span className="prod-save">Save {discount}%</span>}
              </div>

              <p className="prod-short">{selectedProduct.shortDesc}</p>

              <div className="prod-badges">
                <span>✅ {selectedProduct.inStock !== false ? "In Stock" : "Out of Stock"}</span>
                <span>🚚 Free delivery above ₹999</span>
                <span>↩️ 7-day return</span>
              </div>

              <div className="qty-row">
                <label>Qty:</label>
                <input
                  type="number" min="1" max="10"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))}
                  className="qty-input"
                />
                <button className="add" onClick={handleAdd} disabled={selectedProduct.inStock === false}>
                  {selectedProduct.inStock === false ? "Out of Stock" : "Add To Cart 🛒"}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetails;
