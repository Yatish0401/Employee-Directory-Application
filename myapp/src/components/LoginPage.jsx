import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .cdn-login-root {
    height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #0a0f1e;
    overflow: hidden;
    position: relative;
  }

  /* ── LEFT PANEL ── */
  .cdn-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 60px 70px;
    position: relative;
    background: linear-gradient(145deg, #0d1b3e 0%, #0a0f1e 60%, #112244 100%);
    overflow: hidden;
    height: 100vh;
  }

  .cdn-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,180,255,0.12) 0%, transparent 70%);
    animation: pulse 6s ease-in-out infinite;
  }

  .cdn-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 380px; height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
    animation: pulse 8s ease-in-out infinite reverse;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.15); opacity: 0.7; }
  }

  .cdn-logo-badge {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 60px;
    position: relative;
    z-index: 2;
  }

  .cdn-logo-icon {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, #00b4ff, #6366f1);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    box-shadow: 0 8px 24px rgba(0,180,255,0.35);
  }

  .cdn-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: white;
    line-height: 1.2;
  }

  .cdn-logo-text span {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: rgba(255,255,255,0.45);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .cdn-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
    margin-bottom: 24px;
    position: relative;
    z-index: 2;
  }

  .cdn-hero-title .accent {
    background: linear-gradient(90deg, #00b4ff, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cdn-hero-desc {
    font-size: 15px;
    color: rgba(255,255,255,0.5);
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 48px;
    position: relative;
    z-index: 2;
  }

  .cdn-features {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 2;
  }

  .cdn-feature-item {
    display: flex;
    align-items: center;
    gap: 16px;
    animation: fadeUp 0.6s ease both;
  }

  .cdn-feature-item:nth-child(1) { animation-delay: 0.1s; }
  .cdn-feature-item:nth-child(2) { animation-delay: 0.2s; }
  .cdn-feature-item:nth-child(3) { animation-delay: 0.3s; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .cdn-feature-dot {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .cdn-feature-label {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    font-weight: 400;
  }

  .cdn-feature-label strong {
    display: block;
    color: white;
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 2px;
  }

  .cdn-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 1;
  }

  /* ── MIDDLE PANEL (FORM) ── */
  .cdn-middle {
    width: 530px;
    flex-shrink: 0;
    background: #f8faff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    padding: 48px 54px 50px 50px;
    position: relative;
    overflow: hidden;
    height: 100vh;
    box-shadow: -8px 0 40px rgba(0,0,0,0.2);
    z-index: 2;
  }

  .cdn-right-top {
    margin-bottom: 28px;
    animation: fadeUp 0.5s ease both;
  }

  .cdn-welcome-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #e8f0ff;
    color: #4f6ef7;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 14px;
  }

  .cdn-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #0d1b3e;
    margin-bottom: 6px;
  }

  .cdn-form-sub {
    font-size: 13px;
    color: #8a93a8;
  }

  .cdn-field {
    margin-bottom: 18px;
    animation: fadeUp 0.5s ease both;
  }

  .cdn-field:nth-child(1) { animation-delay: 0.1s; }
  .cdn-field:nth-child(2) { animation-delay: 0.2s; }

  .cdn-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #2d3a5e;
    margin-bottom: 7px;
    letter-spacing: 0.3px;
  }

  .cdn-input-wrap {
    position: relative;
  }

  .cdn-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    opacity: 0.5;
    pointer-events: none;
  }

  .cdn-input {
    width: 100%;
    padding: 12px 14px 12px 42px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    background: white;
    color: #0d1b3e;
    transition: all 0.2s;
    outline: none;
  }

  .cdn-input:focus {
    border-color: #4f6ef7;
    box-shadow: 0 0 0 4px rgba(79,110,247,0.1);
  }

  .cdn-input.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 4px rgba(239,68,68,0.08);
  }

  .cdn-error-msg {
    font-size: 12px;
    color: #ef4444;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cdn-forgot {
    display: flex;
    justify-content: flex-end;
    margin-top: 7px;
  }

  .cdn-forgot-btn {
    background: none;
    border: none;
    font-size: 12px;
    color: #4f6ef7;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    padding: 0;
    text-decoration: none;
    transition: color 0.2s;
  }

  .cdn-forgot-btn:hover { color: #3b55d4; }

  .cdn-alert {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cdn-captcha {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    transform: scale(0.92);
    transform-origin: center;
  }

  .cdn-btn-row {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    animation: fadeUp 0.5s ease 0.3s both;
  }

  .cdn-btn-primary {
    flex: 1;
    padding: 13px;
    background: linear-gradient(135deg, #4f6ef7, #6366f1);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 16px rgba(79,110,247,0.35);
  }

  .cdn-btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(79,110,247,0.45);
  }

  .cdn-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

  .cdn-btn-otp {
    flex: 1;
    padding: 13px;
    background: white;
    color: #4f6ef7;
    border: 1.5px solid #c7d3ff;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cdn-btn-otp:hover:not(:disabled) {
    background: #f0f4ff;
    border-color: #4f6ef7;
    transform: translateY(-1px);
  }

  .cdn-btn-otp:disabled { opacity: 0.65; cursor: not-allowed; }

  .cdn-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    color: #cbd5e1;
    font-size: 12px;
  }

  .cdn-divider::before, .cdn-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  .cdn-register-wrap {
    text-align: center;
    animation: fadeUp 0.5s ease 0.4s both;
  }

  .cdn-register-text {
    font-size: 13px;
    color: #8a93a8;
    margin-bottom: 10px;
  }

  .cdn-btn-register {
    display: block;
    width: 100%;
    padding: 12px;
    background: white;
    color: #0d1b3e;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
    margin-bottom: 16px;
  }

  .cdn-btn-register:hover {
    border-color: #0d1b3e;
    background: #0d1b3e;
    color: white;
  }

  .cdn-superadmin-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.2s;
    font-weight: 500;
  }

  .cdn-superadmin-link:hover { color: #ef4444; }

  /* ── RIGHT PANEL (INFO/STATS) ── */
  .cdn-right-info {
    width: 300px;
    flex-shrink: 0;
    background: linear-gradient(160deg, #0d1b3e 0%, #0a0f1e 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 48px 32px;
    position: relative;
    overflow: hidden;
    height: 100vh;
    border-left: 1px solid rgba(255,255,255,0.06);
  }

  .cdn-right-info::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    animation: pulse 7s ease-in-out infinite;
  }

  .cdn-right-info::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -60px;
    width: 250px; height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,180,255,0.1) 0%, transparent 70%);
    animation: pulse 9s ease-in-out infinite reverse;
  }

  .cdn-info-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    position: relative;
    z-index: 2;
  }

  .cdn-info-sub {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 36px;
    position: relative;
    z-index: 2;
    line-height: 1.5;
  }

  /* Stat Cards */
  .cdn-stat-cards {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 36px;
    position: relative;
    z-index: 2;
  }

  .cdn-stat-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.3s;
    animation: fadeUp 0.6s ease both;
  }

  .cdn-stat-card:nth-child(1) { animation-delay: 0.1s; }
  .cdn-stat-card:nth-child(2) { animation-delay: 0.2s; }
  .cdn-stat-card:nth-child(3) { animation-delay: 0.3s; }

  .cdn-stat-card:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(79,110,247,0.3);
    transform: translateX(4px);
  }

  .cdn-stat-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .cdn-stat-info {
    flex: 1;
  }

  .cdn-stat-value {
    font-size: 22px;
    font-weight: 700;
    color: white;
    line-height: 1;
    margin-bottom: 3px;
  }

  .cdn-stat-label {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    font-weight: 400;
  }

  /* Trusted badge */
  .cdn-trusted {
    position: relative;
    z-index: 2;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 16px 18px;
  }

  .cdn-trusted-title {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
    font-weight: 600;
  }

  .cdn-trusted-dots {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cdn-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 2px solid #0a0f1e;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: white;
    margin-left: -6px;
    flex-shrink: 0;
  }

  .cdn-avatar:first-child { margin-left: 0; }

  .cdn-trusted-count {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-left: 8px;
    font-weight: 500;
  }

  /* Responsive */
  @media (max-width: 1100px) {
    .cdn-right-info { display: none; }
  }
  @media (max-width: 768px) {
    .cdn-left { display: none; }
    .cdn-middle { width: 100%; padding: 40px 28px; }
  }
`;

function Login() {
  const [values, setValues] = useState({ identifier: "", password: "" });
  const [captchaValue, setCaptchaValue] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCaptcha = (value) => setCaptchaValue(value);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "identifier" && /^\d*$/.test(value)) {
      if (value.length <= 10) setValues((prev) => ({ ...prev, [name]: value }));
    } else if (name === "password") {
      if (value.length <= 8) setValues((prev) => ({ ...prev, [name]: value }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.identifier.trim()) {
      newErrors.identifier = "Email or phone number is required";
    } else if (/^\d+$/.test(values.identifier)) {
      if (values.identifier.length !== 10)
        newErrors.identifier = "Phone number must be exactly 10 digits";
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.identifier))
        newErrors.identifier = "Please enter a valid email address";
    }
    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (!/[A-Z]/.test(values.password)) {
      newErrors.password = "Must include at least 1 uppercase letter";
    } else if (!/[a-z]/.test(values.password)) {
      newErrors.password = "Must include at least 1 lowercase letter";
    } else if (!/[0-9]/.test(values.password)) {
      newErrors.password = "Must include at least 1 number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) {
      newErrors.password = "Must include at least 1 special character";
    }
    return newErrors;
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (!captchaValue) {
      setErrors({ general: "Please complete CAPTCHA verification." });
      return;
    }
    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8081/login", {
          ...values,
          captcha: captchaValue,
        });
        if (response.data.message === "Success") {
          const userData = response.data.user || response.data;
          localStorage.setItem("user", JSON.stringify(userData));
          try {
            await axios.post("http://localhost:8081/activity", {
              userId: userData.id,
              userName: userData.name || userData.username,
              action: "Login",
              module: "Auth",
              details: `User logged in — Name: ${userData.name}, Role: ${userData.role}, Email: ${userData.email}`,
            });
          } catch (err) {}
          try {
            const existing = JSON.parse(localStorage.getItem("activityLogs") || "[]");
            localStorage.setItem("activityLogs", JSON.stringify([{
              id: Date.now(), action: "Login", module: "Auth",
              details: `User logged in — Name: ${userData.name}, Role: ${userData.role}`,
              performedBy: userData.name || userData.username || "Unknown",
              timestamp: new Date().toISOString(),
            }, ...existing]));
          } catch {}
          navigate("/");
        } else {
          setErrors({ general: response.data.error || "Login failed. Try again." });
        }
      } catch (error) {
        setErrors({
          general: error.response?.status === 401
            ? "Invalid credentials. Please try again."
            : "Server error. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cdn-login-root">

        {/* ── LEFT PANEL ── */}
        <div className="cdn-left">
          <div className="cdn-grid-bg" />
          <div className="cdn-logo-badge">
            <div className="cdn-logo-icon">💼</div>
            <div className="cdn-logo-text">
              CDN Software Solutions
              <span>Pvt. Ltd.</span>
            </div>
          </div>
          <h1 className="cdn-hero-title">
            Manage your<br />
            <span className="accent">orders smarter</span><br />
            than ever.
          </h1>
          <p className="cdn-hero-desc">
            A unified platform to track ITAR orders, hardware procurement,
            AV POs, and more — all in one place.
          </p>
          <div className="cdn-features">
            {[
              { icon: "🔐", bg: "rgba(0,180,255,0.12)", title: "Role-Based Access", desc: "Fine-grained permissions for every team member" },
              { icon: "📦", bg: "rgba(99,102,241,0.12)", title: "Order Tracking", desc: "Real-time status across ITAR, Hardware & AV orders" },
              { icon: "📊", bg: "rgba(16,185,129,0.12)", title: "Reports & Insights", desc: "Export, filter and analyze your order data" },
            ].map((f, i) => (
              <div className="cdn-feature-item" key={i}>
                <div className="cdn-feature-dot" style={{ background: f.bg }}>{f.icon}</div>
                <div className="cdn-feature-label">
                  <strong>{f.title}</strong>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MIDDLE PANEL (FORM) ── */}
        <div className="cdn-middle">
          <div className="cdn-right-top">
            <div className="cdn-welcome-tag">
              <span>✦</span> Secure Portal
            </div>
            <h2 className="cdn-form-title">Sign in to continue</h2>
            <p className="cdn-form-sub">Welcome back! Enter your credentials below.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="cdn-alert">⚠ {errors.general}</div>
            )}

            <div className="cdn-field">
              <label className="cdn-label">Email / Phone</label>
              <div className="cdn-input-wrap">
                <span className="cdn-input-icon">📧</span>
                <input
                  type="text"
                  name="identifier"
                  value={values.identifier}
                  onChange={handleInput}
                  placeholder="Enter email or 10-digit phone"
                  className={`cdn-input ${errors.identifier ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.identifier && <div className="cdn-error-msg">⚠ {errors.identifier}</div>}
            </div>

            <div className="cdn-field">
              <label className="cdn-label">Password</label>
              <div className="cdn-input-wrap">
                <span className="cdn-input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  maxLength="8"
                  placeholder="Enter your password"
                  onChange={handleInput}
                  className={`cdn-input ${errors.password ? "error" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.password && <div className="cdn-error-msg">⚠ {errors.password}</div>}
              <div className="cdn-forgot">
                <button
                  type="button"
                  className="cdn-forgot-btn"
                  onClick={() => {
                    const email = values.identifier.trim();
                    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                      alert("❌ Please enter a valid email address to reset password.");
                      return;
                    }
                    navigate("/forgot-password", { state: { email } });
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* <div className="cdn-captcha">
              <ReCAPTCHA
                sitekey="6LebAwgsAAAAAAy1a78kvOKk9qpWhVrT4POAfilH"
                onChange={handleCaptcha}
              />
            </div> */}

            <div className="cdn-btn-row">
              <button type="submit" className="cdn-btn-primary" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <button
                type="button"
                className="cdn-btn-otp"
                disabled={loading}
                onClick={() => {
                  if (!isValidEmail(values.identifier)) {
                    alert("Please enter a valid email first.");
                    return;
                  }
                  navigate("/otp-login", { state: { email: values.identifier } });
                }}
              >
                Sign in via OTP
              </button>
            </div>
          </form>

          <div className="cdn-divider">or</div>

          <div className="cdn-register-wrap">
            <p className="cdn-register-text">Don't have an account?</p>
            <Link to="/signup" className="cdn-btn-register">Create New Account</Link>
            <Link to="/superadmin-login" className="cdn-superadmin-link">
              🛡 Super Admin Access
            </Link>
          </div>
        </div>

        {/* ── RIGHT INFO PANEL ── */}
       <div className="cdn-right-info">
          <h3 className="cdn-info-title"></h3>
          <p className="cdn-info-sub"></p>

          <div className="cdn-stat-cards">
            {[
              
            ].map((s, i) => (
              <div className="cdn-stat-card" key={i}>
                <div className="cdn-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div className="cdn-stat-info">
                  <div className="cdn-stat-value">{s.value}</div>
                  <div className="cdn-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="cdn-trusted">
            
            
          </div>
        </div>  

      </div>
    </>
  );
}

export default Login;