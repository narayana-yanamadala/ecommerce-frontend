import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import "./otpmodal.css";

const API = "https://ecommerce-backend-y36c.onrender.com/api/checkout";

const OTPModal = ({ token, onVerified, onClose }) => {
  const [otp, setOtp]           = useState(["","","","","",""]);
  const [timer, setTimer]       = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [otpDisplay, setOtpDisplay] = useState(""); // show OTP inline in modal
  const [sent, setSent]         = useState(false);
  const inputRefs               = useRef([]);
  const hasSentRef              = useRef(false); // ← prevents StrictMode double-call

  // Wrapped in useCallback so it has a stable identity across renders.
  // This lets us safely list it as a useEffect dependency without
  // triggering re-sends — hasSentRef still guards the "only once on mount" logic.
  const sendOtp = useCallback(async () => {
    setSent(false);
    setOtpDisplay("");
    try {
      const res  = await fetch(`${API}/otp/send/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();
      const code = data.otp;

      // Store OTP locally to display inside modal (single source of truth)
      setOtpDisplay(code);
      setSent(true);
      setTimer(120);
      setCanResend(false);

      // Show ONE toast (dismiss any previous ones first)
      toast.dismiss();
      toast.info(
        <div style={{ lineHeight: "1.6" }}>
          <strong>🔐 Checkout OTP</strong><br />
          Your OTP: <strong style={{ fontSize: "20px", letterSpacing: "4px", color: "#0f3460" }}>{code}</strong><br />
          <small style={{ color: "#888" }}>Valid for 2 minutes</small>
        </div>,
        { toastId: "checkout-otp", autoClose: 30000, closeOnClick: false }
      );
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    }
  }, [token]);

  useEffect(() => {
    // StrictMode fires effects twice — guard with ref
    if (hasSentRef.current) return;
    hasSentRef.current = true;
    sendOtp();
  }, [sendOtp]);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleResend = () => {
    hasSentRef.current = true; // keep guard active
    setOtp(["","","","","",""]);
    setError("");
    sendOtp();
  };

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val.slice(-1);
    setOtp(updated);
    setError("");
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      inputRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API}/otp/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
        body: JSON.stringify({ otp: code }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.dismiss("checkout-otp");
        toast.success("✅ OTP verified! Proceeding to payment...");
        onVerified();
      } else {
        setError(data.error || "Incorrect OTP. Please try again.");
        setOtp(["","","","","",""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = () => `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;

  return (
    <div className="otp-overlay" onClick={onClose}>
      <div className="otp-modal" onClick={e => e.stopPropagation()}>
        <button className="otp-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="otp-icon">🔐</div>
        <h3>Verify Your Identity</h3>
        <p>A 6-digit OTP has been generated for your checkout. Enter it below to proceed.</p>

        {/* OTP display box inside modal — single source of truth */}
        {sent && otpDisplay && (
          <div className="otp-display-box">
            <span className="otp-display-label">Your OTP</span>
            <span className="otp-display-code">{otpDisplay}</span>
            <span className="otp-display-hint">Copy and enter below</span>
          </div>
        )}

        <div className="otp-boxes">
          {otp.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              ref={el => inputRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className={`otp-inp ${error ? "otp-inp--err" : d ? "otp-inp--filled" : ""}`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {error && <p className="otp-err">❌ {error}</p>}

        <div className="otp-timer">
          {canResend ? (
            <button className="otp-resend" onClick={handleResend}>🔄 Resend OTP</button>
          ) : (
            <span>OTP expires in <strong style={{ color: "#e94560" }}>{fmt()}</strong></span>
          )}
        </div>

        <button
          className="otp-verify-btn"
          onClick={handleVerify}
          disabled={loading || otp.join("").length < 6}
        >
          {loading ? "Verifying..." : "Verify & Continue →"}
        </button>
      </div>
    </div>
  );
};

export default OTPModal;