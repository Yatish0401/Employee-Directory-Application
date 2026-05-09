// Signup.jsx - Role Selection with Database Roles
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
// import ReCAPTCHA from "react-google-recaptcha";

const STYLE_ID = "signup-component-styles-v2";

const styles = `
* { box-sizing: border-box; }
html,body,#root { height: 100%; margin: 0; padding: 0; }

.app-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 10% 10%, rgba(255,255,255,0.06), transparent 10%),
              linear-gradient(135deg, rgba(20,30,48,1) 0%, rgba(15,50,85,1) 100%);
  overflow: hidden;
  padding: 40px 20px;
  transition: background 400ms ease;
}

.bg-blob {
  position: absolute;
  filter: blur(36px);
  opacity: 0.16;
  transform-origin: center;
  animation: floaty 8s ease-in-out infinite;
  z-index: 0;
}
.bg-blob.b1 { width: 460px; height: 460px; border-radius: 50%; background: linear-gradient(45deg,#ff6b6b,#ffb86b); top: -10%; left: -8%; animation-delay: 0s; }
.bg-blob.b2 { width: 360px; height: 360px; border-radius: 50%; background: linear-gradient(45deg,#7afcff,#4f46e5); bottom: -12%; right: -6%; animation-delay: 2s; }

@keyframes floaty {
  0% { transform: translateY(0) scale(1) rotate(0deg); }
  50% { transform: translateY(-18px) scale(1.03) rotate(8deg); }
  100% { transform: translateY(0) scale(1) rotate(0deg); }
}

.card-3d {
  position: relative;
  width: 520px;
  max-width: 95%;
  background: linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.82));
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 18px 40px rgba(2,6,23,0.3), inset 0 1px 0 rgba(255,255,255,0.6);
  z-index: 2;
  backdrop-filter: blur(6px);
  max-height: 92vh;
  overflow-y: auto;
}

.card-3d::-webkit-scrollbar { width: 8px; }
.card-3d::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
.card-3d::-webkit-scrollbar-thumb { background: rgba(14,165,169,0.4); border-radius: 10px; }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #083047;
  margin: 0;
}
.theme-dots { display: flex; gap: 10px; }

.theme-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.6);
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
  transition: transform 150ms;
}
.theme-dot:hover { transform: scale(1.15); }

.form-control {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(10,10,10,0.08);
  outline: none;
  font-size: 14px;
  background: rgba(255,255,255,0.9);
  transition: box-shadow 180ms ease, transform 180ms ease;
  box-shadow: 0 2px 6px rgba(11,22,33,0.04);
}
.form-control:focus {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(9,30,60,0.12);
  border-color: rgba(12,80,120,0.25);
}

label { display: block; font-size: 13px; margin-bottom: 6px; color: #0b3b45; font-weight: 600; }
.mb-3 { margin-bottom: 14px; }
.row { display: flex; gap: 12px; }
.col-md-6 { flex: 1; }

.btn-primary-3d {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: linear-gradient(90deg, #0ea5a9, #0b7285);
  color: white;
  letter-spacing: 0.3px;
  box-shadow: 0 16px 36px rgba(11,45,60,0.14);
  transition: transform 160ms ease, box-shadow 160ms ease;
}
.btn-primary-3d:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(11,45,60,0.2); }
.btn-primary-3d:active { transform: translateY(2px); }
.btn-primary-3d:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-light-ghost {
  margin-top: 10px;
  background: transparent;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid rgba(12,80,120,0.08);
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  display: block;
  text-align: center;
  color: #083047;
  transition: all 200ms;
}
.btn-light-ghost:hover { background: rgba(14,165,169,0.05); }

.text-danger { color: #d43f3a; font-size: 13px; display: block; margin-top: 6px; }
.alert { padding: 8px 10px; border-radius: 8px; background: #ffe6e6; color: #8a1f1f; font-weight: 600; margin-bottom: 12px; }
.small { font-size: 13px; color: #23494f; margin-top: 10px; text-align: center; }
.hint { font-size: 12px; color: #4b5563; margin-top: 6px; }

.role-select-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.role-option {
  padding: 12px 14px;
  border: 2px solid rgba(10,10,10,0.08);
  border-radius: 10px;
  cursor: pointer;
  background: rgba(255,255,255,0.9);
  transition: all 200ms ease;
  text-align: center;
  position: relative;
}

.role-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(9,30,60,0.1);
}

.role-option.selected {
  border-color: #0ea5a9;
  background: linear-gradient(135deg, rgba(14,165,169,0.12), rgba(11,114,133,0.08));
  box-shadow: 0 4px 12px rgba(14,165,169,0.25);
}

.role-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.role-label {
  font-weight: 700;
  color: #083047;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
}

.role-desc {
  font-size: 11px;
  color: #4b5563;
}

.required-badge {
  display: inline-block;
  background: #ff6b6b;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
  font-weight: 700;
}

.app-wrap[data-theme="ocean"] { background: linear-gradient(135deg,#001f3f,#003d66); }
.app-wrap[data-theme="sunset"] { background: linear-gradient(135deg,#ffecd2,#fcb69f); }
.app-wrap[data-theme="mint"] { background: linear-gradient(135deg,#e8f5e9,#c8f7d6); }
.app-wrap[data-theme="violet"] { background: linear-gradient(135deg,#4f46e5,#9b5de5); }

.theme-dot.ocean { background: linear-gradient(45deg,#1fb6ff,#023e8a); }
.theme-dot.sunset { background: linear-gradient(45deg,#ff6b6b,#ffb86b); }
.theme-dot.mint { background: linear-gradient(45deg,#34d399,#10b981); }
.theme-dot.violet { background: linear-gradient(45deg,#7c3aed,#c084fc); }

@media (max-width:580px) {
  .card-3d { padding: 18px; }
  .bg-blob { display: none; }
  .role-select-container { grid-template-columns: 1fr; }
  .row { flex-direction: column; }
}
`;

function ensureStyles() {
  if (typeof document === "undefined") return;
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.innerHTML = styles;
    document.head.appendChild(s);
  }
}

function Signup() {
  ensureStyles();

  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    permissions: []
  });

  // const [captchaValue, setCaptchaValue] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("mint");
  const [roles, setRoles] = useState([]);
  const [rolesLoaded, setRolesLoaded] = useState(false); // ✅ Track loading state
  // const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://https://employee-directory-application-xzt1.onrender.com/roles");
      console.log("✅ Roles fetched:", response.data);

      // Filter out superadmin from signup options
      const filteredRoles = response.data.filter(
        (role) => role.role_name.toLowerCase() !== "superadmin"
      );

      console.log("✅ Available roles for signup:", filteredRoles);
      setRoles(filteredRoles);
    } catch (error) {
      console.error("❌ Error fetching roles:", error);
    } finally {
      setRolesLoaded(true); // ✅ Always mark loaded whether success or fail
    }
  };

  useEffect(() => {
    const el = document.querySelector(".app-wrap");
    if (el) el.setAttribute("data-theme", theme);
  }, [theme]);

  const handleCaptcha = (value) => {
    // setCaptchaValue(value);
    setErrors((prev) => ({
      ...prev,
      general:
        prev.general === "⚠️ Please verify CAPTCHA before signup."
          ? ""
          : prev.general,
    }));
  };

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRoleSelect = (roleId) => {
    const selectedRole = roles.find((r) => r.id === roleId);
    setValues({
      ...values,
      role: roleId,
      permissions: selectedRole ? selectedRole.permissions : [],
    });
    setErrors({ ...errors, role: "" });
    console.log("✅ Role selected:", selectedRole?.role_name);
    console.log("✅ Permissions assigned:", selectedRole?.permissions);
  };

  const validate = () => {
    const errs = {};

    if (!values.name.trim()) errs.name = "Name is required";

    if (values.username && values.username.length < 3)
      errs.username = "Username must be at least 3 characters";

    if (!values.email) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Invalid email";

    if (!values.phone || values.phone.length < 10)
      errs.phone = "Valid phone is required";

    if (!values.password) errs.password = "Password required";
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(values.password))
      errs.password = "Min 8 chars, 1 uppercase, 1 special symbol required";

    if (values.password !== values.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    // ✅ Role required ONLY when roles exist in DB (not first user)
    if (rolesLoaded && roles.length > 0 && !values.role)
      errs.role = "⚠️ Please select a role to continue";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    setErrors(formErrors);

    // if (!captchaValue) {
    //   const cap = document.querySelector(".recaptcha-container");
    //   if (cap) cap.scrollIntoView({ behavior: "smooth", block: "center" });
    //   setErrors((prev) => ({
    //     ...prev,
    //     general: "⚠️ Please verify CAPTCHA before signup.",
    //   }));
    //   return;
    // }

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      try {
        console.log("📤 Sending signup data:", {
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: values.role,        // empty string when first user - backend handles it
          permissions: values.permissions,
        });

        const res = await axios.post(
          "http://https://employee-directory-application-xzt1.onrender.com/signup",
          {
            name: values.name,
            username: values.username,
            email: values.email,
            phone: values.phone,
            password: values.password,
            role: values.role,           // ✅ empty = first user, backend assigns superadmin
            permissions: values.permissions,
            // captcha: captchaValue,
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
          }
        );
if (res.data.message === "User created successfully" || res.data.success) {
          const assignedRole = res.data.role || values.role || "USER";
          
          // Activity log save karo
          try {
            const existing = JSON.parse(localStorage.getItem('activityLogs') || '[]');
            localStorage.setItem('activityLogs', JSON.stringify([{
              id: Date.now(),
              action: "Created",
              module: "Auth",
              details: `New account created via Signup — Name: ${values.name}, Email: ${values.email} , Role: ${assignedRole.toUpperCase()}, Phone: ${values.phone}`,
              performedBy: values.name || values.email || "Unknown User",
              timestamp: new Date().toISOString(),
            }, ...existing]));
          } catch {}

          if (assignedRole.toLowerCase() === "superadmin") {
            alert("✅ Account created! You are the SuperAdmin. Please login.");
          } else {
            alert("✅ Account created successfully! Please login.");
          }
          // if (recaptchaRef.current) recaptchaRef.current.reset();
          navigate("/login");
        } else {
          setErrors({
            general: res.data.error || res.data.message || "Signup failed",
          });
          if (
            res.data.error &&
            /captcha/i.test(res.data.error)
            // recaptchaRef.current
          ) {
            // recaptchaRef.current.reset();
            // setCaptchaValue("");
          }
        }
      } catch (err) {
        console.error("Signup error:", err);

        let errorMessage = "⚠️ Server error occurred";

        if (err.response) {
          errorMessage =
            err.response.data?.error ||
            err.response.data?.message ||
            `Server error: ${err.response.status}`;
          console.error("Server response:", err.response.data);
        } else if (err.request) {
          errorMessage =
            "⚠️ Cannot connect to server. Please check if server is running on http://https://employee-directory-application-xzt1.onrender.com";
        } else {
          errorMessage = `⚠️ Request error: ${err.message}`;
        }

        setErrors({ general: errorMessage });

        // if (recaptchaRef.current) {
        //   try {
        //     recaptchaRef.current.reset();
        //   } catch (e) {}
        //   // setCaptchaValue("");
        // }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app-wrap" data-theme={theme}>
      <div className="bg-blob b1" aria-hidden />
      <div className="bg-blob b2" aria-hidden />

      <div className="card-3d" role="region" aria-label="Signup form">
        <div className="card-header">
          <h3 className="card-title">Create account</h3>
          <div className="theme-dots" title="Change theme">
            <div className="theme-dot mint" onClick={() => setTheme("mint")} aria-label="Mint theme" role="button" />
            <div className="theme-dot ocean" onClick={() => setTheme("ocean")} aria-label="Ocean theme" role="button" />
            <div className="theme-dot violet" onClick={() => setTheme("violet")} aria-label="Violet theme" role="button" />
            <div className="theme-dot sunset" onClick={() => setTheme("sunset")} aria-label="Sunset theme" role="button" />
          </div>
        </div>

        {errors.general && (
          <div className="alert" role="alert">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="mb-3">
            <label><strong>Name</strong></label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleInput}
              placeholder="Enter full name"
              className="form-control"
              autoComplete="name"
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>

          {/* Username */}
          <div className="mb-3">
            <label><strong>Username</strong> (optional)</label>
            <input
              type="text"
              name="username"
              value={values.username}
              onChange={handleInput}
              placeholder="Enter username (optional)"
              className="form-control"
              autoComplete="username"
            />
            {errors.username && <span className="text-danger">{errors.username}</span>}
            <div className="hint">Optional - can be used for login instead of email</div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleInput}
              placeholder="Enter email"
              className="form-control"
              autoComplete="email"
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label><strong>Phone</strong></label>
            <PhoneInput
              country={"in"}
              value={values.phone}
              onChange={(phone) => {
                setValues({ ...values, phone });
                setErrors({ ...errors, phone: "" });
              }}
              inputClass="form-control"
              containerStyle={{ width: "100%" }}
              specialLabel={""}
              enableSearch={true}
              searchPlaceholder="Search country..."
            />
            {errors.phone && <span className="text-danger">{errors.phone}</span>}
            <div className="hint">Use country code (e.g. +91...)</div>
          </div>

          {/* Password */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label><strong>Password</strong></label>
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleInput}
                placeholder="Enter password"
                className="form-control"
                minLength="8"
                autoComplete="new-password"
              />
              {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>
            <div className="col-md-6">
              <label><strong>Confirm Password</strong></label>
              <input
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleInput}
                placeholder="Confirm password"
                className="form-control"
                minLength="8"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* ✅ ROLE SECTION - Smart 3-state logic */}
          <div className="mb-3">
            <label>
              <strong>Select Role</strong>
              {/* Show REQUIRED badge only when roles exist */}
              {rolesLoaded && roles.length > 0 && (
                <span className="required-badge">REQUIRED</span>
              )}
            </label>

            {/* STATE 1: Still fetching roles from DB */}
            {!rolesLoaded ? (
              <div style={{
                padding: "20px",
                textAlign: "center",
                color: "#666",
                background: "#f9f9f9",
                borderRadius: "8px",
                border: "1px solid #e0e0e0"
              }}>
                ⏳ Loading roles...
              </div>

            ) : roles.length === 0 ? (
              /* STATE 2: No roles in DB = First user = Auto SuperAdmin */
              <div style={{
                padding: "16px",
                background: "#e8f5e9",
                borderRadius: "8px",
                border: "1px solid #4caf50",
                textAlign: "center",
                color: "#2e7d32"
              }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>👑</div>
                <strong style={{ fontSize: "15px" }}>First User Setup</strong>
                <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#388e3c" }}>
                  You will be automatically assigned as <strong>SuperAdmin</strong> since no other users exist yet.
                </p>
              </div>

            ) : (
              /* STATE 3: Roles exist = Show role selection cards */
              <div className="role-select-container">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`role-option ${values.role === role.id ? "selected" : ""}`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={values.role === role.id}
                      readOnly
                    />
                    <span className="role-label">{role.role_name}</span>
                    <span className="role-desc">
                      {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""} assigned
                    </span>

                    {/* Show permissions preview when this role is selected */}
                    {values.role === role.id && role.permissions.length > 0 && (
                      <div style={{
                        marginTop: "8px",
                        padding: "8px",
                        background: "#f0f0f0",
                        borderRadius: "4px",
                        fontSize: "11px",
                        textAlign: "left"
                      }}>
                        <strong>Permissions:</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                          {role.permissions.map((perm, idx) => (
                            <span key={idx} style={{
                              background: "#d4edda",
                              color: "#155724",
                              padding: "2px 6px",
                              borderRadius: "3px"
                            }}>
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {errors.role && <span className="text-danger">{errors.role}</span>}
          </div>

          {/* ReCAPTCHA */}
          {/* <div className="mb-3 recaptcha-container" style={{ display: "flex", justifyContent: "center" }}>
            <ReCAPTCHA
              sitekey="6LebAwgsAAAAAAy1a78kvOKk9qpWhVrT4POAfilH"
              onChange={handleCaptcha}
              ref={recaptchaRef}
            />
          </div> */}

          <button
            type="submit"
            className="btn-primary-3d"
            disabled={loading || !rolesLoaded}
            aria-busy={loading}
          >
            {!rolesLoaded
              ? "Loading..."
              : loading
              ? "Creating Account..."
              : "Sign Up"}
          </button>
        </form>

        <p className="small">Already have an account?</p>
        <Link to="/login" className="btn-light-ghost" role="button">
          Login Here
        </Link>
      </div>
    </div>
  );
}

export default Signup;