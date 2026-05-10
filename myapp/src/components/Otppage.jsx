import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";

function OtpLogin() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const sendOtp = async () => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setErrors({ general: "Please enter a valid email address" });
    return;
  }

  setLoading(true);
  setErrors({});

  try {
    // Step 1: Backend se OTP generate karwao aur DB mein save karo
    const res = await axios.post("https://employee-directory-application-xzt1.onrender.com/generate-otp", {
      email: email.trim(),
    });

    if (!res.data.success) {
      setErrors({ general: res.data.message || "Failed to generate OTP" });
      return;
    }

    const generatedOtp = res.data.otp;

    // Step 2: EmailJS se email bhejo
   await emailjs.send(
  "service_8j2np2q",
  "ssodxvh",
  {
    to_email: email.trim(),
    email: email.trim(),
    passcode: res.data.otp,
    time: "10 minutes",
  }
 
);

    setOtpSent(true);
    alert("✅ OTP sent to your email!");

  } catch (err) {
  console.error("❌ Full Error:", JSON.stringify(err));
  console.error("❌ Error text:", err?.text);
  console.error("❌ Error status:", err?.status);
  setErrors({ general: err?.text || "Failed to send OTP. Please try again." });
}finally {
    setLoading(false);
  }
};

  const verifyOtp = async (e) => {
    e.preventDefault();
    
    if (!email || !otp) {
      setErrors({ general: "Please enter both email and OTP" });
      return;
    }

    if (otp.length !== 6) {
      setErrors({ general: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await axios.post("https://employee-directory-application-xzt1.onrender.com/verify-email-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      if (res.data.success) {
        const userData = res.data.user || res.data;
        // Role fix karo — alag alag field names handle karo
        const fixedUser = {
          ...userData,
          role: userData.role || userData.Role || userData.user_role || userData.userRole || "USER"
        };
        localStorage.setItem("user", JSON.stringify(fixedUser));
        console.log("✅ OTP verified, user logged in:", fixedUser);

        // Activity log save karo
        const loginLog = {
          id: Date.now(),
          action: "Login",
          module: "Auth",
          details: `User logged in via OTP — Name: ${fixedUser.name}, Role: ${fixedUser.role}, Email: ${fixedUser.email}`,
          performedBy: fixedUser.name || fixedUser.username || "Unknown User",
          timestamp: new Date().toISOString(),
        };
        try {
          const existing = JSON.parse(localStorage.getItem('activityLogs') || '[]');
         localStorage.setItem('activityLogs', JSON.stringify([loginLog, ...existing]));
        } catch {}

        alert("✅ Login successful!");
        navigate("/");
      } else {
      
        setErrors({ general: res.data.message || "Invalid OTP" });
      }
    } catch (err) {
      console.error("❌ Verify OTP error:", err);
      if (err.response?.status === 400) {
        setErrors({ general: "Invalid or expired OTP. Please request a new one." });
      } else {
        setErrors({ general: "OTP verification failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setOtpSent(false); 
    setOtp(""); 
    if (errors.general) {
      setErrors({});
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
    if (errors.general) {
      setErrors({});
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light vh-100">
      <div className="bg-white p-4 rounded w-25" style={{ minWidth: "320px" }}>
        <h2 className="text-center mb-4">Email OTP Login</h2>
        
        {errors.general && (
          <div className="alert alert-danger">{errors.general}</div>
        )}

        <form onSubmit={verifyOtp}>
          <div className="mb-3">
            <label><strong>Email Address</strong></label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              disabled={loading}
              required
            />
            {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
              <small className="text-warning">⚠️ Please enter a valid email</small>
            )}
          </div>

          <div className="mb-3">
            <label><strong>OTP Code</strong></label>
            <div className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                disabled={loading}
                required
              />
              <button
                type="button"
                className={`btn ${otpSent ? 'btn-outline-success' : 'btn-outline-primary'}`}
                onClick={sendOtp}
                disabled={loading || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              >
                {loading ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
              </button>
            </div>
            {otp && (
              <small className="text-muted">{otp.length}/6 digits entered</small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mb-3"
            disabled={loading || !email || !otp || otp.length !== 6}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Verifying...
              </>
            ) : (
              "Verify OTP & Login"
            )}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="btn btn-link">
            ← Back to Sign In
          </Link>
        </div>

        {otpSent && (
          <div className="mt-3 p-2 bg-light rounded">
            <small className="text-muted">
              📧 OTP sent to {email}. Check your inbox and  enter the 6-digit code above.
              You can request a new OTP if needed.
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

export default OtpLogin;