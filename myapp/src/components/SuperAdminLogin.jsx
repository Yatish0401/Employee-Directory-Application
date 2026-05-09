import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import ReCAPTCHA from "react-google-recaptcha";

function SuperAdminLogin() {
  const [values, setValues] = useState({
    identifier: "",
    password: "",
  });

  // const [captchaValue, setCaptchaValue] = useState(null); // ✅ null instead of ""
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.identifier.trim()) {
      newErrors.identifier = "Email or phone number is required";
    } else if (/^\d+$/.test(values.identifier)) {
      if (values.identifier.length !== 10) {
        newErrors.identifier = "Phone number must be exactly 10 digits";
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.identifier)) {
        newErrors.identifier = "Invalid email format";
      }
    }

    if (!values.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // if (!captchaValue) {
    //   setErrors({ general: "⚠️ Please verify CAPTCHA before login." });
    //   return;
    // }

    setErrors({});
    setLoading(true);

    try {
      console.log("🔵 Sending login request...");  // ADD THIS
      
      const response = await axios.post("http://https://employee-directory-application-xzt1.onrender.com/login", {
        ...values,
        captcha: "bypass",
      });

      console.log("✅ Login response:", response.data);  // ADD THIS

      if (response.data.message === "Success") {
        const user = response.data.user;
        
        console.log("👤 User role:", user.role);  // ADD THIS

       if (user.role?.toLowerCase() === "superadmin") {
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isSuperAdmin", "true");

          // ✅ Activity log save karo
          try {
            const existing = JSON.parse(localStorage.getItem('activityLogs') || '[]');
            localStorage.setItem('activityLogs', JSON.stringify([{
              id: Date.now(),
              action: "Login",
              module: "Auth",
              details: `SuperAdmin logged in — Name: ${user.name}, Email: ${user.email}, Role: SUPERADMIN`,
              performedBy: user.name || user.username || "SuperAdmin",
              timestamp: new Date().toISOString(),
            }, ...existing]));
          } catch {}

          navigate("/superadmin-dashboard");
        } else {
          setErrors({
            general: `❌ Access denied. Your role is: ${user.role}`,  // MODIFIED - shows actual role
          });
        }
      } else {
        setErrors({
          general: response.data.error || "Login failed. Invalid credentials.",
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      setErrors({
        general: error.response?.data?.message || "⚠️ Network/Server error — Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };
      

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#f5f7fa",
        padding: "20px",
      }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{
          width: "400px",
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e0e6ed",
        }}
      >
        <h3 className="text-center mb-1" style={{ fontWeight: 700 }}>
          Super Admin Login
        </h3>
        <p className="text-center text-muted" style={{ fontSize: "14px" }}>
          Secure Access • Developer Dashboard
        </p>

        {errors.general && (
          <div className="alert alert-danger text-center">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={{ fontWeight: 600 }}>Email / Phone</label>
            <input
              type="text"
              name="identifier"
              placeholder="Enter email or phone"
              value={values.identifier}
              onChange={handleInput}
              className={`form-control ${errors.identifier ? "is-invalid" : ""}`}
              disabled={loading}
              style={{ height: "45px" }}
            />
            {errors.identifier && (
              <div className="invalid-feedback d-block">
                {errors.identifier}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label style={{ fontWeight: 600 }}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleInput}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              disabled={loading}
              style={{ height: "45px" }}
            />
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          {/* <div className="d-flex justify-content-center my-3">
            <ReCAPTCHA
              sitekey="6LebAwgsAAAAAAy1a78kvOKk9qpWhVrT4POAfilH"
              onChange={(value) => {
                console.log("✅ CAPTCHA value set:", value ? "received" : "null");
                // setCaptchaValue(value);
              }}
              onExpired={() => {
                console.log("⚠️ CAPTCHA expired");
                setCaptchaValue(null);
              }}
            />
          </div> */}

          <button
            type="submit"
            className="btn w-100"
            disabled={loading}
            style={{
              background: "#0052cc",
              color: "white",
              height: "45px",
              fontWeight: 600,
              borderRadius: "8px",
            }}
          >
            {loading ? "Signing In..." : "Login as Super Admin"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">
            Back to normal login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;