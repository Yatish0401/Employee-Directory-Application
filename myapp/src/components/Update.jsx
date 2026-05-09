import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Update() {
    const { id } = useParams();
    const [values, setValues] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        permissions: []
    });
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    const roles = [
        { value: "user", label: "User", desc: "Basic user access" },
        { value: "employee", label: "Employee", desc: "Standard employee access" },
        { value: "manager", label: "Manager", desc: "Team management access" },
        { value: "admin", label: "Admin", desc: "Full system access" },
        { value: "contractor", label: "Contractor", desc: "Temporary project access" },
        { value: "superadmin", label: "Super Admin", desc: "Complete control" }
    ];

    const availablePermissions = [
        { value: "read", label: "Read" },
        { value: "write", label: "Write" },
        { value: "delete", label: "Delete" },
        { value: "manage_users", label: "Manage Users" },
        { value: "reports", label: "Reports" },
        { value: "settings", label: "Settings" }
    ];

    useEffect(() => {
        // Fetch profile data
        axios
            .get("http://https://employee-directory-application-xzt1.onrender.com/users/" + id)
            .then((res) => {
                const profileData = res.data;
                setUserId(profileData.user_id);
                
                // Fetch user account data (role and permissions)
                if (profileData.user_id) {
                    axios
                        .get(`http://https://employee-directory-application-xzt1.onrender.com/users/${profileData.user_id}/full`)
                        .then((userRes) => {
                            let perms = [];
                            if (userRes.data.permissions) {
                                if (typeof userRes.data.permissions === 'string') {
                                    try {
                                        perms = JSON.parse(userRes.data.permissions);
                                    } catch (e) {
                                        perms = [];
                                    }
                                } else if (Array.isArray(userRes.data.permissions)) {
                                    perms = userRes.data.permissions;
                                }
                            }

                            setValues({
                                name: profileData.name,
                                email: profileData.email,
                                phone: profileData.phone,
                                role: userRes.data.role || "user",
                                permissions: perms
                            });
                        })
                        .catch((err) => console.log("Error fetching user data:", err));
                }
            })
            .catch((err) => console.log(err));
    }, [id]);

    const handleRoleChange = (roleValue) => {
        setValues({ ...values, role: roleValue });
    };

    const handlePermissionToggle = (permValue) => {
        const currentPermissions = values.permissions;
        const newPermissions = currentPermissions.includes(permValue)
            ? currentPermissions.filter(p => p !== permValue)
            : [...currentPermissions, permValue];
        
        setValues({ ...values, permissions: newPermissions });
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            superadmin: "#dc3545",
            admin: "#ffc107",
            manager: "#17a2b8",
            employee: "#0d6efd",
            contractor: "#6c757d",
            user: "#28a745"
        };
        return colors[role?.toLowerCase()] || "#6c757d";
    };

    const handleUpdate = (event) => {
        event.preventDefault();
        
        console.log("🔍 Profile ID:", id);
        console.log("🔍 User ID:", userId);
        console.log("🔍 Values:", values);
        
        // Update profile data
        axios
            .put(`http://https://employee-directory-application-xzt1.onrender.com/profiles/${id}`, {
                name: values.name,
                email: values.email,
                phone: values.phone
            })
            .then((response) => {
                console.log("✅ Profile update response:", response.data);
                // Update user role and permissions in usersTest table
                if (userId) {
                    console.log("🔄 Sending role/permissions update to user ID:", userId);
                    axios
                        .put(`http://https://employee-directory-application-xzt1.onrender.com/account/${userId}/role-permissions`, {
                            role: values.role,
                            permissions: values.permissions
                        })
                        .then((roleResponse) => {
                            console.log("✅ Role/permissions update response:", roleResponse.data);
                            alert("✅ Profile and role/permissions updated successfully!");
                            navigate("/");
                        })
                        .catch((err) => {
                            console.error("❌ Error updating role/permissions:", err);
                            console.error("❌ Error response:", err.response?.data);
                            console.error("❌ Error status:", err.response?.status);
                            alert("⚠️ Profile updated but failed to update role/permissions. Check console.");
                        });
                } else {
                    console.log("⚠️ No userId found, skipping role/permissions update");
                    alert("✅ Profile updated successfully!");
                    navigate("/");
                }
            })
            .catch((err) => {
                console.error("❌ Error updating profile:", err);
                alert("❌ Failed to update profile");
            });
    };

    return (
        <div
            className="d-flex w-100 justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #F0F4FF, #FDFDFD)",
                padding: "40px 20px",
            }}
        >
            <div
                className="p-4 shadow-lg"
                style={{
                    width: "600px",
                    maxWidth: "95%",
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                    color: "#1E293B",
                }}
            >
                <h2
                    className="text-center fw-bold mb-4"
                    style={{ letterSpacing: "0.5px", color: "#0F172A" }}
                >
                    ✏️ Update User Profile
                </h2>

                <form onSubmit={handleUpdate}>
                    {/* Name */}
                    <div className="mb-3">
                        <label className="fw-semibold mb-1">Full Name</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter full name"
                            value={values.name}
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                border: "1px solid #CBD5E1",
                                padding: "12px",
                            }}
                            onChange={(e) => setValues({ ...values, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="fw-semibold mb-1">Email Address</label>
                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Enter email"
                            value={values.email}
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                border: "1px solid #CBD5E1",
                                padding: "12px",
                            }}
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="fw-semibold mb-1">Phone Number</label>
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter phone number"
                            value={values.phone}
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                border: "1px solid #CBD5E1",
                                padding: "12px",
                            }}
                            onChange={(e) => setValues({ ...values, phone: e.target.value })}
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="mb-3">
                        <label className="fw-semibold mb-2">Select Role</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                            {roles.map((role) => (
                                <div
                                    key={role.value}
                                    onClick={() => handleRoleChange(role.value)}
                                    style={{
                                        padding: "12px",
                                        borderRadius: "10px",
                                        border: values.role === role.value 
                                            ? `2px solid ${getRoleBadgeColor(role.value)}` 
                                            : "2px solid #E2E8F0",
                                        background: values.role === role.value 
                                            ? `${getRoleBadgeColor(role.value)}15` 
                                            : "white",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        textAlign: "center"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (values.role !== role.value) {
                                            e.currentTarget.style.borderColor = "#CBD5E1";
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (values.role !== role.value) {
                                            e.currentTarget.style.borderColor = "#E2E8F0";
                                            e.currentTarget.style.transform = "translateY(0)";
                                        }
                                    }}
                                >
                                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A" }}>
                                        {role.label}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                                        {role.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Permissions Selection */}
                    <div className="mb-4">
                        <label className="fw-semibold mb-2">Select Permissions</label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                            {availablePermissions.map((perm) => (
                                <div
                                    key={perm.value}
                                    onClick={() => handlePermissionToggle(perm.value)}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #E2E8F0",
                                        background: values.permissions.includes(perm.value) 
                                            ? "#0d6efd15" 
                                            : "white",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={values.permissions.includes(perm.value)}
                                        onChange={() => {}}
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            cursor: "pointer",
                                            accentColor: "#0d6efd"
                                        }}
                                    />
                                    <span style={{ fontSize: "13px", fontWeight: "500", color: "#0F172A" }}>
                                        {perm.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <small style={{ color: "#64748B", fontSize: "12px", display: "block", marginTop: "8px" }}>
                            Selected: {values.permissions.length > 0 ? values.permissions.join(", ") : "None"}
                        </small>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between gap-2">
                        <button
                            type="submit"
                            className="btn btn-primary px-4 py-2"
                            style={{
                                fontWeight: "600",
                                borderRadius: "12px",
                                fontSize: "16px",
                                flex: 1,
                                background: "#2563EB",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35)",
                            }}
                        >
                            💾 Update Profile
                        </button>

                        <Link
                            to="/"
                            className="btn px-4 py-2"
                            style={{
                                fontWeight: "600",
                                borderRadius: "12px",
                                fontSize: "16px",
                                flex: 1,
                                border: "2px solid #475569",
                                color: "#475569",
                                background: "transparent",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            ← Back
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Update;