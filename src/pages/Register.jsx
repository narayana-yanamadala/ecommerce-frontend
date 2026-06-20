import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./auth.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm) { toast.error("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { toast.error("Passwords do not match!"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("https://ecommerce-backend-y36c.onrender.com/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        toast.success("Account created! Welcome to Multimart! 🎉");
        navigate("/");
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch {
      toast.error("Cannot connect to server. Make sure Django is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <ion-icon name="bag"></ion-icon>
          <h1>Multimart</h1>
        </div>
        <div className="auth-promo">
          <h2>India's Most <span>Trusted</span><br />Online Store</h2>
          <p>Create your free account today and unlock exclusive deals, faster checkout, order tracking, and a personalized shopping experience.</p>
          <ul className="auth-features">
            <li>Instant access to 10,000+ products</li>
            <li>Exclusive first-order discount of 10%</li>
            <li>Pay with UPI, Cards or Net Banking</li>
            <li>Real-time order tracking</li>
            <li>Wishlist & price drop alerts</li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Create Account 🚀</h2>
            <p>Join Multimart for free and start shopping today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <div className="auth-input-wrap">
                <ion-icon name="person-outline"></ion-icon>
                <input type="text" name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <ion-icon name="mail-outline"></ion-icon>
                <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "44px" }}
                />
                <ion-icon
                  name={showPass ? "eye-off-outline" : "eye-outline"}
                  style={{ position:"absolute", right:"14px", left:"auto", cursor:"pointer", pointerEvents:"all" }}
                  onClick={() => setShowPass(!showPass)}
                ></ion-icon>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <ion-icon name="shield-checkmark-outline"></ion-icon>
                <input type="password" name="confirm" placeholder="Repeat your password" value={form.confirm} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Free Account →"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
          <p className="auth-terms">
            By registering, you agree to our <a href="#!">Terms of Service</a> and <a href="#!">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
