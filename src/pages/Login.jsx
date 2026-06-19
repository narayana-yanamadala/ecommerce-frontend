import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./auth.css";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        toast.success(`Welcome back, ${data.username}! 🎉`);
        navigate("/");
      } else {
        toast.error(data.error || "Login failed.");
      }
    } catch {
      toast.error("Cannot connect to server. Make sure Django is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left promo panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <ion-icon name="bag"></ion-icon>
          <h1>Multimart</h1>
        </div>
        <div className="auth-promo">
          <h2>Shop Smarter,<br />Save <span>Bigger!</span></h2>
          <p>Join millions of happy shoppers and discover amazing deals on electronics, fashion, furniture & more — all at your fingertips.</p>
          <ul className="auth-features">
            <li>Free delivery on orders above ₹999</li>
            <li>100% secure Razorpay & UPI payments</li>
            <li>Easy 7-day returns, no questions asked</li>
            <li>Exclusive member-only deals & offers</li>
            <li>24/7 customer support always ready</li>
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back 👋</h2>
            <p>Sign in to access your account and continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <div className="auth-input-wrap">
                <ion-icon name="person-outline"></ion-icon>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="auth-switch">
            New to Multimart? <Link to="/register">Create a free account</Link>
          </p>
          <p className="auth-terms">
            By signing in, you agree to our <a href="#!">Terms of Service</a> and <a href="#!">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
