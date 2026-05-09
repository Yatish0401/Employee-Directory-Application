import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Create() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    website: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;

    if (name === "phone" && value && !/^\d*$/.test(value)) return;
    if (name === "phone" && value.length > 15) return;

    setValues(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.name.trim()) newErrors.name = "Name is required";

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Invalid email address";
    }

    if (values.phone && !/^\d{10}$/.test(values.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (values.website &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/.test(values.website)
    ) {
      newErrors.website = "Invalid website URL";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      if (!user) {
        alert("Please log in first");
        navigate("/login");
        return;
      }

      setLoading(true);

      const profileData = { ...values, userId: user.id };

      axios.post("https://employee-directory-application-xzt1.onrender.com/users", profileData)
        .then(() => {
          alert("Profile created successfully!");
          navigate("/");
        })
        .catch(err => {
          console.error(err);

          setErrors({
            general: err.response?.data?.error || "Failed to create profile"
          });
          setLoading(false);
        });
    }
  };

  if (!user) {
    return (
      <div className="d-flex w-10 vh-100 justify-content-center align-items-center"
           style={{ background: "linear-gradient(135deg, #e8f0ff, #f8fbff)" }}>
        <div className="border bg-white shadow-lg px-5 py-4 rounded" style={{ width: "350px" }}>
          <h3 className="text-center fw-bold mb-3">Login Required</h3>
          <p className="text-center text-muted">You must log in before creating a profile.</p>
          <div className="text-center mt-3">
            <Link to="/login" className="btn btn-primary px-4 me-3">Login</Link>
            <Link to="/signup" className="btn btn-outline-primary px-4">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center"
         style={{ background: "linear-gradient(135deg, #dfe9f3, #ffffff)" }}>
      
      <div className="bg-white shadow-lg rounded p-4"
           style={{ width: "5%", minWidth: "420px", borderRadius: "12px" }}>

       
        <div className="mb-4 text-center">
          <h2 className="fw-bold text-primary">Create New Profile</h2>
          <div
            style={{
              height: "3px",
              width: "70px",
              background: "#0d6efd",
              margin: "8px auto",
              borderRadius: "5px",
            }}
          ></div>
          <span className="badge bg-info mt-2">Logged in as: {user.name}</span>
        </div>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          
         
          <div className="mb-3">
            <label className="fw-semibold">Full Name *</label>
            <input
              type="text"
              name="name"
              className={`form-control shadow-sm ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter full name"
              value={values.name}
              onChange={handleInput}
              disabled={loading}
              style={{ borderRadius: "8px" }}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          
          <div className="mb-3">
            <label className="fw-semibold">Email Address *</label>
            <input
              type="email"
              name="email"
              className={`form-control shadow-sm ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter email"
              value={values.email}
              onChange={handleInput}
              disabled={loading}
              style={{ borderRadius: "8px" }}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

         
          <div className="mb-3">
            <label className="fw-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className={`form-control shadow-sm ${errors.phone ? "is-invalid" : ""}`}
              placeholder="10 digits"
              value={values.phone}
              onChange={handleInput}
              disabled={loading}
              style={{ borderRadius: "8px" }}
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          
          <div className="mb-3">
            <label className="fw-semibold">Role</label>
            <input
              type="text"
              name="username"
              className="form-control shadow-sm"
              placeholder="Enter role"
              value={values.username}
              onChange={handleInput}
              disabled={loading}
              style={{ borderRadius: "8px" }}
            />
          </div>

          
          <div className="mb-3">
            <label className="fw-semibold">Website URL</label>
            <input
              type="url"
              name="website"
              className={`form-control shadow-sm ${errors.website ? "is-invalid" : ""}`}
              placeholder="Enter website"
              value={values.website}
              onChange={handleInput}
              disabled={loading}
              style={{ borderRadius: "8px" }}
            />
            {errors.website && <div className="invalid-feedback">{errors.website}</div>}
          </div>

          
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-primary px-4"
              disabled={loading}
              style={{ borderRadius: "8px" }}
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>

            <Link to="/" className="btn btn-outline-secondary px-4" style={{ borderRadius: "8px" }}>
              Cancel
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Create;
