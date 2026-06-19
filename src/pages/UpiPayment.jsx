import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct } from "../app/features/cart/cartSlice";
import { toast } from "react-toastify";
import "./upipayment.css";

const STEPS = { QR: "qr", OTP: "otp", VERIFYING: "verifying", SUCCESS: "success" };

const UpiPayment = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const dispatch   = useDispatch();
  const { cartList } = useSelector((state) => state.cart);

  const amount   = location.state?.amount   || 0;
  const items    = location.state?.cartList || [];

  const [step, setStep]         = useState(STEPS.QR);
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [timer, setTimer]       = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");

  const upiId  = "8688012658@ybl";
  const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=${upiId}%26pn=Multimart%26am=${amount}%26cu=INR%26tn=MultimartOrder`;

  // Generate a random 6-digit OTP
  const generateOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return code;
  };

  // Countdown timer
  useEffect(() => {
    if (step !== STEPS.OTP) return;
    if (timer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const handleProceedToOtp = () => {
    const code = generateOtp();
    // Show OTP in a toast (simulating SMS — in production this would be sent via SMS API)
    toast.info(
      <div>
        <strong>📱 UPI Confirmation OTP</strong><br />
        Your OTP is: <strong style={{fontSize:"20px",color:"#5f259f",letterSpacing:"4px"}}>{code}</strong><br />
        <small>Valid for 2 minutes</small>
      </div>,
      { autoClose: 30000, closeOnClick: false }
    );
    setStep(STEPS.OTP);
    setTimer(120);
    setCanResend(false);
  };

  const handleResendOtp = () => {
    const code = generateOtp();
    toast.info(
      <div>
        <strong>📱 New OTP</strong><br />
        Your new OTP is: <strong style={{fontSize:"20px",color:"#5f259f",letterSpacing:"4px"}}>{code}</strong>
      </div>,
      { autoClose: 30000 }
    );
    setTimer(120);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    setOtpError("");
    // Auto-focus next box
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    if (enteredOtp !== generatedOtp) { setOtpError("❌ Incorrect OTP. Please try again."); return; }

    setStep(STEPS.VERIFYING);
    // Simulate verification delay
    setTimeout(() => {
      // Clear cart
      items.forEach((item) => dispatch(deleteProduct(item)));
      // Navigate to success
      navigate("/order-success", {
        state: {
          via: "PhonePe / UPI",
          paymentId: "UPI-" + Date.now(),
          orderId: "ORD-" + Math.floor(Math.random() * 900000 + 100000),
          amount,
        },
      });
    }, 2000);
  };

  const formatTimer = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section className="upi-page">
      <Container>
        <div className="upi-card">

          {/* ── STEP 1: QR Code ── */}
          {step === STEPS.QR && (
            <>
              <div className="upi-header">
                <button className="back-btn" onClick={() => navigate("/cart")}>← Back to Cart</button>
                <h2>📱 Pay via UPI</h2>
                <p>Scan the QR code with any UPI app</p>
              </div>

              <div className="upi-amount-box">
                <span>Amount to Pay</span>
                <h3>₹{Number(amount).toLocaleString("en-IN")}</h3>
              </div>

              <div className="qr-wrap">
                <img src={qrUrl} alt="UPI QR" className="qr-img" />
                <div className="qr-apps">
                  <span>Scan with any app</span>
                  <div className="app-pills">
                    <span>📱 PhonePe</span>
                    <span>💚 GPay</span>
                    <span>🟦 Paytm</span>
                    <span>🏦 BHIM</span>
                  </div>
                </div>
              </div>

              <div className="upi-id-box">
                <p>Or pay directly to UPI ID:</p>
                <div className="upi-id-row">
                  <strong>{upiId}</strong>
                  <button onClick={() => { navigator.clipboard.writeText(upiId); toast.success("UPI ID copied!"); }}>📋 Copy</button>
                </div>
              </div>

              <div className="upi-steps">
                <div className="step"><span>1</span> Open PhonePe / GPay</div>
                <div className="step"><span>2</span> Scan QR or enter UPI ID</div>
                <div className="step"><span>3</span> Pay ₹{Number(amount).toLocaleString("en-IN")}</div>
                <div className="step"><span>4</span> Click button below</div>
              </div>

              <button className="confirm-btn" onClick={handleProceedToOtp}>
                ✅ I Have Paid — Verify with OTP
              </button>
              <p className="upi-note">After paying, click above to confirm with OTP</p>
            </>
          )}

          {/* ── STEP 2: OTP Entry ── */}
          {step === STEPS.OTP && (
            <>
              <div className="upi-header">
                <button className="back-btn" onClick={() => setStep(STEPS.QR)}>← Back to QR</button>
                <h2>🔐 Enter OTP</h2>
                <p>Check the notification on this screen for your OTP</p>
              </div>

              <div className="upi-amount-box">
                <span>Verifying Payment of</span>
                <h3>₹{Number(amount).toLocaleString("en-IN")}</h3>
              </div>

              <div className="otp-section">
                <div className="otp-hint">
                  <ion-icon name="information-circle-outline"></ion-icon>
                  OTP was shown as a notification above (toast message). Check top-right of your screen.
                </div>

                <div className="otp-boxes">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className={`otp-box ${otpError ? "otp-error" : digit ? "otp-filled" : ""}`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {otpError && <p className="otp-err-msg">{otpError}</p>}

                <div className="otp-timer">
                  {canResend ? (
                    <button className="resend-btn" onClick={handleResendOtp}>🔄 Resend OTP</button>
                  ) : (
                    <p>OTP expires in <strong style={{color:"#e94560"}}>{formatTimer()}</strong></p>
                  )}
                </div>
              </div>

              <button
                className="confirm-btn"
                onClick={handleVerifyOtp}
                disabled={otp.join("").length < 6}
              >
                🔓 Verify & Confirm Payment
              </button>

              <p className="upi-note">
                📞 Need help? Call <strong>+91 8688012658</strong>
              </p>
            </>
          )}

          {/* ── STEP 3: Verifying ── */}
          {step === STEPS.VERIFYING && (
            <div className="verifying-section">
              <div className="spinner">⏳</div>
              <h3>Verifying Payment...</h3>
              <p>Please wait while we confirm your transaction</p>
              <div className="verify-progress">
                <div className="verify-bar"></div>
              </div>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
};

export default UpiPayment;
