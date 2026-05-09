import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaUserEdit, FaArrowLeft } from "react-icons/fa";

function Read() {
  const [data, setData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("https://employee-directory-application-xzt1.onrender.com/users/" + id)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "#eef2f7",
      }}
    >
      <div
        className="p-4 rounded shadow-lg"
        style={{
          background: "white",
          width: "450px",
          borderRadius: "14px",
        }}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: "#2c3e50" }}>
          👤 User Details
        </h3>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Name</label>
          <div className="p-2 border rounded">{data.name || "-"}</div>
        </div>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Email</label>
          <div className="p-2 border rounded">{data.email || "-"}</div>
        </div>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Phone</label>
          <div className="p-2 border rounded">{data.phone || "-"}</div>
        </div>

        <div className="mb-3">
          <label className="fw-semibold text-secondary">Role</label>
          <div className="p-2 border rounded">{data.username || "-"}</div>
        </div>

        <div className="mb-4">
          <label className="fw-semibold text-secondary">Website</label>
          <div className="p-2 border rounded">{data.website || "-"}</div>
        </div>

        {/* BUTTONS */}
        <div className="d-flex justify-content-between">
          <Link
            to={`/update/${id}`}
            className="btn btn-warning text-white d-flex align-items-center"
          >
            <FaUserEdit className="me-2" />
            Edit
          </Link>

          <Link
            to="/"
            className="btn btn-secondary d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Read;
