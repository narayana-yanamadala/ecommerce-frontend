import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../hooks/useAddress";
import { deleteProduct } from "../app/features/cart/cartSlice";
import AddressCard from "../components/AddressCard/AddressCard";
import OTPModal from "../components/OTPModal/OTPModal";
import { toast } from "react-toastify";
import "./checkout.css";

const API = "http://127.0.0.1:8000/api/checkout";

const PAYMENT_METHODS = [
  { id: "razorpay", label: "Razorpay", icon: "💳", desc: "Cards, UPI, Netbanking" },
  { id: "upi",      label: "UPI",      icon: "📱", desc: "PhonePe, GPay, Paytm" },
  { id: "cod",      label: "Cash on Delivery", icon: "🏠", desc: "Pay at your doorstep" },
  { id: "wallet",   label: "Wallet",   icon: "👜", desc: "Multimart Wallet Balance" },
];

const Checkout = () => {
  const { user }       = useAuth();
  const navigate       = useNavigate();
  const dispatch       = useDispatch();
  const { cartList }   = useSelector(s => s.cart);
  const { addresses, addAddress } = useAddress(user?.token);

  const [selectedAddr,  setSelectedAddr]  = useState(null);
  const [payMethod,     setPayMethod]     = useState("razorpay");
  const [couponCode,    setCouponCode]    = useState("");
  const [couponData,    setCouponData]    = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showOTP,       setShowOTP]       = useState(false);
  const [otpVerified,   setOtpVerified]   = useState(false);
  const [placing,       setPlacing]       = useState(false);

  // Redirect if not logged in or cart empty
  useEffect(() => {
    if (!user)              { navigate("/login"); return; }
    if (cartList.length === 0) { navigate("/cart"); return; }
    window.scrollTo(0, 0);
  }, [user, cartList, navigate]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddr) {
      const def = addresses.find(a => a.is_default) || addresses[0];
      setSelectedAddr(def);
    }
  }, [addresses]);

  // Pricing
  const subtotal      = cartList.reduce((s, i) => s + i.price * i.qty, 0);
  const discount      = couponData ? couponData.discount_amount : 0;
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const tax           = parseFloat((subtotal * 0.18 / 100).toFixed(2));
  const grandTotal    = parseFloat((subtotal - discount + deliveryCharge + tax).toFixed(2));

  // Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error("Enter a coupon code."); return; }
    setCouponLoading(true);
    try {
      const res  = await fetch(`${API}/coupon/apply/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${user.token}` },
        body: JSON.stringify({ code: couponCode, amount: subtotal }),
      });
      const data = await res.json();
      if (res.ok) { setCouponData(data); toast.success(data.message); }
      else        { toast.error(data.error); setCouponData(null); }
    } catch { toast.error("Failed to apply coupon."); }
    finally { setCouponLoading(false); }
  };

  // Place order + payment
  const handlePlaceOrder = async () => {
    if (!selectedAddr) { toast.error("Please select a delivery address."); return; }
    if (payMethod !== "cod" && !otpVerified) { setShowOTP(true); return; }
    setPlacing(true);

    try {
      const res  = await fetch(`${API}/orders/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${user.token}` },
        body: JSON.stringify({
          address_id:     selectedAddr.id,
          payment_method: payMethod,
          cart_items:     cartList,
          subtotal,
          discount,
          delivery_charge: deliveryCharge,
          coupon_code:    couponData?.code || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Order failed."); setPlacing(false); return; }

      if (payMethod === "razorpay") {
        openRazorpay(data);
      } else if (payMethod === "upi") {
        navigate("/upi-payment", { state: { amount: grandTotal, cartList, orderId: data.order_id } });
      } else {
        // COD / Wallet
        cartList.forEach(i => dispatch(deleteProduct(i)));
        navigate("/order-success", {
          state: {
            via:      payMethod === "cod" ? "Cash on Delivery" : "Wallet",
            orderId:  `ORD-${data.order_id}`,
            amount:   grandTotal,
            address:  selectedAddr,
          },
        });
      }
    } catch { toast.error("Connection error. Please try again."); }
    finally { setPlacing(false); }
  };

  const openRazorpay = (orderData) => {
    const options = {
      key:         orderData.razorpay_key,
      amount:      orderData.amount,
      currency:    "INR",
      name:        "Multimart",
      description: `Order #${orderData.order_id}`,
      order_id:    orderData.razorpay_order_id,
      prefill:     { name: user.username, email: user.email || "" },
      theme:       { color: "#0f3460" },
      handler: async (response) => {
        try {
          const vRes  = await fetch(`${API}/orders/confirm/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Token ${user.token}` },
            body: JSON.stringify({ ...response, order_id: orderData.order_id }),
          });
          const vData = await vRes.json();
          if (vRes.ok) {
            cartList.forEach(i => dispatch(deleteProduct(i)));
            navigate("/order-success", {
              state: {
                via:       "Razorpay",
                paymentId: response.razorpay_payment_id,
                orderId:   `ORD-${orderData.order_id}`,
                amount:    grandTotal,
                address:   selectedAddr,
              },
            });
          } else { toast.error(vData.error || "Payment verification failed."); }
        } catch { toast.error("Verification error."); }
      },
      modal: { ondismiss: () => { toast.info("Payment cancelled."); setPlacing(false); } },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => { toast.error("Payment failed."); setPlacing(false); });
    rzp.open();
  };

  return (
    <section className="checkout-page">
      <Container>
        <h2 className="checkout-title">Checkout</h2>

        {/* Checkout Steps Indicator */}
        <div className="checkout-steps">
          <div className="step-item step-done"><span>1</span> Cart</div>
          <div className="step-divider"></div>
          <div className="step-item step-active"><span>2</span> Address</div>
          <div className="step-divider"></div>
          <div className="step-item"><span>3</span> Payment</div>
          <div className="step-divider"></div>
          <div className="step-item"><span>4</span> Done</div>
        </div>

        <Row>
          {/* Left: Address + Payment */}
          <Col md={7}>
            {/* Address Section */}
            <div className="co-section">
              <div className="co-section-header">
                <h4>📍 Delivery Address</h4>
                <button className="co-link" onClick={() => navigate("/addresses")}>+ Manage Addresses</button>
              </div>
              {addresses.length === 0 ? (
                <div className="co-no-addr">
                  <p>No saved addresses. Add one to continue.</p>
                  <button className="btn-add-addr-inline" onClick={() => navigate("/addresses")}>+ Add Address</button>
                </div>
              ) : (
                <div className="co-addr-list">
                  {addresses.map(a => (
                    <AddressCard
                      key={a.id}
                      address={a}
                      selected={selectedAddr?.id === a.id}
                      onSelect={setSelectedAddr}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="co-section">
              <div className="co-section-header"><h4>💳 Payment Method</h4></div>
              <div className="pay-method-grid">
                {PAYMENT_METHODS.map(m => (
                  <div
                    key={m.id}
                    className={`pay-method-card ${payMethod === m.id ? "pay-method-card--active" : ""}`}
                    onClick={() => setPayMethod(m.id)}
                  >
                    <span className="pay-icon">{m.icon}</span>
                    <div>
                      <div className="pay-label">{m.label}</div>
                      <div className="pay-desc">{m.desc}</div>
                    </div>
                    {payMethod === m.id && <span className="pay-check">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* OTP note */}
            {payMethod !== "cod" && (
              <div className="co-otp-note">
                🔐 OTP verification required for secure payment.
                {otpVerified && <span className="verified-badge"> ✅ Verified</span>}
              </div>
            )}
          </Col>

          {/* Right: Order Summary */}
          <Col md={5}>
            <div className="co-summary">
              <h4>🛒 Order Summary</h4>

              {/* Items */}
              <div className="co-items">
                {cartList.map(item => (
                  <div key={item.id} className="co-item">
                    <img src={item.imgUrl} alt={item.productName} />
                    <div className="co-item-info">
                      <p>{item.productName}</p>
                      <span>Qty: {item.qty}</span>
                    </div>
                    <div className="co-item-price">₹{(item.price * item.qty).toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="co-coupon">
                <input
                  placeholder="Enter coupon code (e.g. SAVE20)"
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponData(null); }}
                />
                <button onClick={handleApplyCoupon} disabled={couponLoading}>
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
              {couponData && (
                <p className="co-coupon-success">✅ {couponData.message} — Saving ₹{couponData.discount_amount}</p>
              )}

              {/* Pricing breakdown */}
              <div className="co-pricing">
                <div className="co-price-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                {discount > 0 && <div className="co-price-row co-discount"><span>Coupon Discount</span><span>−₹{discount.toLocaleString("en-IN")}</span></div>}
                <div className="co-price-row"><span>Delivery</span><span style={{color: deliveryCharge===0?"#27ae60":"#e94560"}}>{deliveryCharge===0?"FREE":`₹${deliveryCharge}`}</span></div>
                <div className="co-price-row"><span>Tax (GST)</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="co-price-row co-total"><span><strong>Grand Total</strong></span><span><strong>₹{grandTotal.toLocaleString("en-IN")}</strong></span></div>
              </div>

              <button
                className="co-place-btn"
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddr}
              >
                {placing ? "Processing..." : payMethod === "cod" ? "🏠 Place Order (COD)" : `🔒 Pay ₹${grandTotal.toLocaleString("en-IN")}`}
              </button>
              <p className="co-secure">🔐 256-bit SSL Encrypted · Secure Checkout</p>

              {/* Coupons hint */}
              <div className="co-coupons-hint">
                <p>Available Coupons:</p>
                <div className="coupon-pills">
                  {["MULTIMART10","SAVE20","FIRST50","WELCOME15"].map(c => (
                    <span key={c} className="coupon-pill" onClick={() => setCouponCode(c)}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {showOTP && (
        <OTPModal
          token={user.token}
          onVerified={() => { setOtpVerified(true); setShowOTP(false); setTimeout(handlePlaceOrder, 100); }}
          onClose={() => setShowOTP(false)}
        />
      )}
    </section>
  );
};

export default Checkout;
