import { useState } from "react";
import { Container } from "react-bootstrap";
import "./product-review.css";

const SAMPLE_REVIEWS = [
  { name: "Rahul K.",    rating: 5, text: "Excellent product! Highly recommended." },
  { name: "Priya S.",    rating: 4, text: "Very good quality. Delivered on time." },
  { name: "Anand M.",    rating: 5, text: "Worth every rupee. Great build quality!" },
];

const Stars = ({ rating = 0 }) => (
  <span className="review-stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? "#f59e0b" : "#ddd" }}>★</span>
    ))}
  </span>
);

const ProductReviews = ({ selectedProduct }) => {
  const [tab, setTab] = useState("desc");

  // Always an array — never undefined
  const apiReviews = Array.isArray(selectedProduct?.reviews) ? selectedProduct.reviews : [];
  const reviews    = apiReviews.length > 0 ? apiReviews : SAMPLE_REVIEWS;

  return (
    <section className="product-reviews">
      <Container>
        <ul>
          <li
            style={{ color: tab === "desc" ? "black" : "#9c9b9b", cursor: "pointer" }}
            onClick={() => setTab("desc")}
          >
            Description
          </li>
          <li
            style={{ color: tab === "rev" ? "black" : "#9c9b9b", cursor: "pointer" }}
            onClick={() => setTab("rev")}
          >
            Reviews ({reviews.length})
          </li>
        </ul>

        {tab === "desc" ? (
          <div className="product-desc-text">
            <p>{selectedProduct?.description || selectedProduct?.shortDesc || "No description available."}</p>
            <div className="product-features">
              <div className="feature-item">🚚 Free delivery on orders above ₹999</div>
              <div className="feature-item">↩️ Easy 7-day returns</div>
              <div className="feature-item">🔐 100% Secure Payment</div>
              <div className="feature-item">✅ {selectedProduct?.inStock !== false ? "In Stock" : "Out of Stock"}</div>
            </div>
          </div>
        ) : (
          <div className="rates">
            {reviews.map((r, i) => (
              <div className="rate-comment" key={i}>
                <div className="review-header">
                  <span className="reviewer-name">{r.name || r.author || "Verified Buyer"}</span>
                  <Stars rating={r.rating || 5} />
                </div>
                <p>{r.text || "Great product!"}</p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default ProductReviews;
