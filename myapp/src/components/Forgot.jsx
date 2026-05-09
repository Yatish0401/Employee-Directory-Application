import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Forgot() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const prefilledEmail = location.state?.email || "";

  const [values, setValues] = useState({
    identifier: prefilledEmail,
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (prefilledEmail) {
      setValues((prev) => ({ ...prev, identifier: prefilledEmail }));
    }
  }, [prefilledEmail]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.identifier.trim()) {
      newErrors.identifier = "Email is required";
    } else if (!emailRegex.test(values.identifier)) {
      newErrors.identifier = "Enter a valid email";
    }

    if (!values.newPassword) newErrors.newPassword = "Enter new password";

    if (!values.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";

    if (
      values.newPassword &&
      values.confirmPassword &&
      values.newPassword !== values.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);

      try {
        await axios.post("https://employee-directory-application-xzt1.onrender.com/reset-password", values);
        alert("Password reset successfully!");
        navigate("/login");
      } catch (error) {
        console.error(error);
        alert("Error resetting password. Make sure email is registered.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="bg-white p-4 rounded w-25" style={{ minWidth: "300px" }}>
        <h2 className="text-center mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="text"
              name="identifier"
              value={values.identifier}
              onChange={handleInput}
              className={`form-control ${errors.identifier ? "is-invalid" : ""}`}
              disabled={!!prefilledEmail}   
            />
            {errors.identifier && (
              <div className="invalid-feedback">{errors.identifier}</div>
            )}
          </div>

          <div className="mb-3">
            <label><strong>New Password</strong></label>
            <input
              type="password"
              name="newPassword"
              value={values.newPassword}
              onChange={handleInput}
              className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
            />
            {errors.newPassword && (
              <div className="invalid-feedback">{errors.newPassword}</div>
            )}
          </div>

          <div className="mb-3">
            <label><strong>Confirm Password</strong></label>
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleInput}
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

       
        <div className="text-center mt-3">
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => navigate("/login")}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
