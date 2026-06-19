import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useRef } from "react";
import "./ordersuccess.css";

const OrderSuccess = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const invoiceRef = useRef();

  const paymentId = location.state?.paymentId || null;
  const orderId   = location.state?.orderId   || `ORD-${Date.now()}`;
  const amount    = location.state?.amount    || 0;
  const via       = location.state?.via       || "Online";
  const address   = location.state?.address   || null;

  const handleDownload = () => {
    const content = `
MULTIMART — ORDER INVOICE
==========================
Order ID:    ${orderId}
Date:        ${new Date().toLocaleString("en-IN")}
Payment Via: ${via}
${paymentId ? `Payment ID:  ${paymentId}` : ""}

DELIVERY ADDRESS:
${address ? `${address.full_name}\n${address.phone}\n${address.street}${address.landmark ? ", " + address.landmark : ""}\n${address.city}, ${address.state} - ${address.pincode}` : "N/A"}

Amount Paid: ₹${Number(amount).toLocaleString("en-IN")}
Status:      CONFIRMED

Thank you for shopping with Multimart!
Support: +91 8688012658 | support@multimart.in
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${orderId}-invoice.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="success-page">
      <Container>
        <div className="success-card" ref={invoiceRef}>
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-sub">
            Thank you for shopping with <strong>Multimart</strong>! Your order is confirmed.
          </p>

          <div className="success-order-id">
            Order ID: <strong>{orderId}</strong>
          </div>

          {/* Payment details */}
          <div className="order-details">
            <div className="order-row"><span>Payment Via</span><strong>{via}</strong></div>
            {paymentId && <div className="order-row"><span>Payment ID</span><strong>{paymentId}</strong></div>}
            {amount > 0 && <div className="order-row"><span>Amount Paid</span><strong>₹{Number(amount).toLocaleString("en-IN")}</strong></div>}
            <div className="order-row"><span>Expected Delivery</span><strong>3–5 Business Days</strong></div>
            <div className="order-row"><span>Status</span><strong className="status-confirmed">✅ Confirmed</strong></div>
          </div>

          {/* Delivery address */}
          {address && (
            <div className="success-address">
              <h5>📍 Delivering To:</h5>
              <p><strong>{address.full_name}</strong> · {address.phone}</p>
              <p>{address.street}{address.landmark ? `, ${address.landmark}` : ""}</p>
              <p>{address.city}, {address.state} — {address.pincode}</p>
            </div>
          )}

          <p className="success-note">
            📧 Confirmation will be sent to your registered email.<br />
            📞 Help: <strong>+91 8688012658</strong>
          </p>

          <div className="success-btns">
            <button className="btn-shop" onClick={() => navigate("/shop")}>🛍️ Continue Shopping</button>
            <button className="btn-invoice" onClick={handleDownload}>📄 Download Invoice</button>
            <button className="btn-home" onClick={() => navigate("/")}>🏠 Go to Home</button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OrderSuccess;
