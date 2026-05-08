import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_ROOT = "http://localhost:8081";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [allUsers, setAllUsers] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profiles");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleUsers, setRoleUsers] = useState([]);
  const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);

  const [roles, setRoles] = useState([]);
  const [showQuickAddRoleModal, setShowQuickAddRoleModal] = useState(false);
  const [quickRoleName, setQuickRoleName] = useState("");

  const [newProfile, setNewProfile] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    autoGeneratePassword: false
  });

  /* ================= AUTH CHECK & FETCH ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isSuperAdmin = localStorage.getItem("isSuperAdmin");
    if (isSuperAdmin !== "true" || !user.role) {
      navigate("/superadmin-login");
      return;
    }
    if (user.role.toUpperCase() !== "SUPERADMIN") {
      navigate("/superadmin-login");
      return;
    }

    fetchAllData();
    fetchRoles();

    const handleProfileUpdate = () => { fetchAllData(); fetchRoles(); };
    const handleRoleUpdate = () => { fetchAllData(); fetchRoles(); };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    window.addEventListener("roleUpdated", handleRoleUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
      window.removeEventListener("roleUpdated", handleRoleUpdate);
    };
  }, [navigate]);

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/roles`);
      setRoles(res.data);
    } catch (err) {
      console.error("❌ fetchRoles error:", err.message);
    }
  };

  /* ================= FETCH DATA ================= */
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role = user.role;

      const [ownerProfilesResp, profilesResp] = await Promise.allSettled([
        axios.post(`${API_ROOT}/superadmin/signup-accounts`, { role }),
        axios.post(`${API_ROOT}/superadmin/profiles`, { role }),
      ]);

      setAllUsers(
        ownerProfilesResp.status === "fulfilled"
          ? ownerProfilesResp.value.data || []
          : []
      );
      setAllProfiles(
        profilesResp.status === "fulfilled"
          ? (profilesResp.value.data || []).slice().sort((a, b) => a.id - b.id)
          : []
      );
    } catch (err) {
      console.error("❌ fetchAllData error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const getUserById = (id) => allUsers.find(u => u.id === id);

  const getOwnerName = (profile) => {
    if (profile.owner_name) return profile.owner_name;
    if (profile.creatorUserId || profile.creator_user_id) {
      const creatorId = profile.creatorUserId || profile.creator_user_id;
      const creator = getUserById(creatorId);
      if (creator) return creator.name;
    }
    if (profile.parent_id) {
      const parent = getUserById(profile.parent_id);
      if (parent) return parent.name;
    }
    return "N/A";
  };

  const getBadgeColor = (role) => ({
    superadmin: "danger",
    admin: "warning",
    manager: "info",
    employee: "primary",
    contractor: "secondary",
    user: "success"
  })[role?.toLowerCase()] || "secondary";

  const getRoleIcon = (role) => ({
    superadmin: "👑",
    admin: "🔑",
    manager: "📊",
    employee: "👔",
    user: "👤",
    contractor: "🔧"
  })[role?.toLowerCase()] || "👤";

  const getRoleCount = (roleName) =>
    allProfiles.filter(p =>
      (p.role || "").toLowerCase() === roleName.toLowerCase()
    ).length;

  const bootstrapColors = ["danger", "warning", "info", "primary", "secondary", "dark", "success"];

  /* ================= ROLE DETAILS MODAL ================= */
  const handleRoleCardClick = async (roleName) => {
    const count = getRoleCount(roleName);
    if (count === 0) {
      alert(`No ${roleName} users found`);
      return;
    }

    setSelectedRole(roleName);
    setShowRoleModal(true);
    setLoadingRoleUsers(true);

    try {
      const response = await axios.post(`${API_ROOT}/superadmin/users-by-role`, {
        role: "SUPERADMIN",
        targetRole: roleName.toUpperCase()
      });
      setRoleUsers(response.data);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Failed to fetch users: ${errorMsg}`);
      setShowRoleModal(false);
    } finally {
      setLoadingRoleUsers(false);
    }
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setSelectedRole(null);
    setRoleUsers([]);
  };

  /* ================= ADD PROFILE ================= */
  const openAddModal = () => {
    setNewProfile({
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      autoGeneratePassword: false
    });
    setShowAddModal(true);
  };

  const addProfile = async () => {
    try {
      if (!newProfile.name || !newProfile.email) return alert("Name & Email required");
      if (!newProfile.role) return alert("Role is required!");

      let password = newProfile.password;
      if (newProfile.autoGeneratePassword) {
        password =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8).toUpperCase();
      }
      if (!password) return alert("❌ Password is required!");

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        name: newProfile.name.trim(),
        username: newProfile.username ? newProfile.username.trim() : "",
        email: newProfile.email.trim().toLowerCase(),
        phone: newProfile.phone ? newProfile.phone.trim() : "",
        password,
        role: newProfile.role,
        creatorUserId: currentUser.id,
        permissions: []
      };

      await axios.post(`${API_ROOT}/profiles`, payload);

      setShowAddModal(false);
      setNewProfile({ name: "", username: "", email: "", phone: "", password: "", role: "", autoGeneratePassword: false });

      await fetchAllData();
      await fetchRoles();

      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: { newProfile: payload } }));

      // ✅ Activity log save karo
      try {
        const existing = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        localStorage.setItem('activityLogs', JSON.stringify([{
          id: Date.now(),
          action: "Created",
          module: "User Management",
          details: `Profile created via SuperAdmin — Name: "${newProfile.name}", Email: "${newProfile.email}", Role: "${newProfile.role}"`,
          performedBy: currentUser.name || "SuperAdmin",
          timestamp: new Date().toISOString(),
        }, ...existing]));
      } catch {}

      alert(
        newProfile.autoGeneratePassword
          ? `✅ Profile created!\n\n🔑 Password: ${password}\n\n👤 Owner: ${currentUser.name}`
          : `✅ Profile created!\n\n👤 Owner: ${currentUser.name}`
      );
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      alert(`❌ Add failed: ${errorMsg}`);
    }
  };

  /* ================= EDIT ================= */
  const openEdit = (item) => {
    let perms = [];
    if (item.permissions) {
      if (typeof item.permissions === 'string') {
        try { perms = JSON.parse(item.permissions); } catch { perms = []; }
      } else if (Array.isArray(item.permissions)) {
        perms = item.permissions;
      }
    }
    setEditData({ ...item, role: item.role || "", permissions: perms });
    setShowEditModal(true);
  };

 const updateRecord = async () => {
    try {
      if (!editData || !editData.id) return alert("No item selected");

      // ✅ Old data capture karo BEFORE update
      const oldProfile = allProfiles.find(p => p.id === editData.id) 
                      || allUsers.find(p => p.id === editData.id);

      const profilePayload = {
        name: editData.name || "",
        username: editData.username ? editData.username.trim() : "",
        email: editData.email || "",
        phone: editData.phone || null,
        role: editData.role || "",
        permissions: Array.isArray(editData.permissions) ? editData.permissions : []
      };

      await axios.put(`${API_ROOT}/profiles/${editData.id}`, profilePayload);

      if (editData.user_id) {
        await axios.put(`${API_ROOT}/account/${editData.user_id}/basic-info`, {
          name: editData.name || "",
          email: editData.email || "",
          phone: editData.phone || null,
        });
        await axios.put(`${API_ROOT}/account/${editData.user_id}/role-permissions`, {
          role: editData.role || "",
          permissions: Array.isArray(editData.permissions) ? editData.permissions : []
        });
      }

      // ✅ Kya kya change hua track karo
      const changes = [];
      if (oldProfile?.name !== editData.name)
        changes.push(`Name: "${oldProfile?.name}" → "${editData.name}"`);
      if (oldProfile?.email !== editData.email)
        changes.push(`Email: "${oldProfile?.email}" → "${editData.email}"`);
      if (oldProfile?.phone !== editData.phone)
        changes.push(`Phone: "${oldProfile?.phone || 'N/A'}" → "${editData.phone || 'N/A'}"`);
     if ((oldProfile?.username || '') !== (editData.username || ''))
        changes.push(`Username: "${oldProfile?.username || 'N/A'}" → "${editData.username || 'N/A'}"`);
      if ((oldProfile?.role || '').toUpperCase() !== (editData.role || '').toUpperCase())
        changes.push(`Role: "${oldProfile?.role}" → "${editData.role}"`);

      // ✅ Activity log save karo
      try {
        const existing = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        localStorage.setItem('activityLogs', JSON.stringify([{
          id: Date.now(),
          action: "Updated",
          module: "User Management",
          details: `Profile updated via SuperAdmin — Name: "${editData.name}" | ${changes.length > 0 ? changes.join(", ") : "No changes detected"}`,
          performedBy: currentUser.name || "SuperAdmin",
          timestamp: new Date().toISOString(),
        }, ...existing]));
      } catch {}

      window.dispatchEvent(new CustomEvent("profileUpdated", {
        detail: { profileId: editData.id, updatedData: profilePayload }
      }));

      setShowEditModal(false);
      await fetchAllData();
      alert("✅ Record updated successfully!");
    } catch (err) {
      alert(`Update failed: ${err.response?.data?.error || err.message}`);
    }
  };

  /* ================= DELETE ================= */
  const deleteRecord = async (id) => {
    const profile = allProfiles.find(p => p.id === id) || allUsers.find(p => p.id === id);
    const profileName = profile?.name || "Unknown";
    const profileEmail = profile?.email || "Unknown";
    const profileRole = profile?.role || "Unknown";

    if (!window.confirm(`Are you sure you want to delete profile of "${profileName}"?\n\nThis action cannot be undone!`)) return;
    try {
      await axios.delete(`${API_ROOT}/profiles/${id}`);

      // ✅ Activity log save karo
      try {
        const existing = JSON.parse(localStorage.getItem('activityLogs') || '[]');
        localStorage.setItem('activityLogs', JSON.stringify([{
          id: Date.now(),
          action: "Deleted",
          module: "User Management",
          details: `Profile deleted via SuperAdmin — Name: "${profileName}", Email: "${profileEmail}", Role: "${profileRole}"`,
          performedBy: currentUser.name || "SuperAdmin",
          timestamp: new Date().toISOString(),
        }, ...existing]));
      } catch {}

      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: { deletedId: id } }));
      await fetchAllData();
      alert(`✅ Profile of "${profileName}" deleted successfully`);
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-danger" />
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="container-fluid p-3">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger mb-3">
        <div className="container-fluid">
          <span className="navbar-brand">🛡️ Super Admin Dashboard</span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3 text-white">
              <strong>Logged in as:</strong> {currentUser.name} (ID: {currentUser.id})
            </span>
            <button className="btn btn-outline-light btn-sm me-2" onClick={() => { fetchAllData(); fetchRoles(); }}>
              🔄 Refresh
            </button>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => { localStorage.clear(); navigate("/superadmin-login"); }}
            >
              🔒 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= STATS CARDS - DYNAMIC ================= */}
      <div className="container mt-4">
        <div className="row g-3 text-center">

          {/* Owner Profiles Card */}
          <div className="col-12 col-md-2">
            <div className="card shadow-sm border-0">
              <div className="card-body bg-primary text-white rounded-3">
                <h6>Owner Profiles</h6>
                <h2>{allUsers.length}</h2>
              </div>
            </div>
          </div>

          {/* Dynamic Role Cards from DB */}
          {roles.map((role, idx) => {
            const color = bootstrapColors[idx % bootstrapColors.length];
            const roleLower = role.role_name.toLowerCase();
            const count = getRoleCount(role.role_name);
            return (
              <div key={role.id} className="col-12 col-md-2">
                <div
                  className="card shadow-sm border-0"
                  onClick={() => handleRoleCardClick(roleLower)}
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div className={`card-body bg-${color} text-white rounded-3`}>
                    <h6>{getRoleIcon(roleLower)} {role.role_name.toUpperCase()}</h6>
                    <h2>{count}</h2>
                    <small style={{ fontSize: "10px", opacity: "0.8" }}>Click for details</small>
                  </div>
                </div>
              </div>
            );
          })}



          {/* Total Profiles Card */}
          <div className="col-12 col-md-2 mt-3">
            <div className="card shadow-sm border-0">
              <div className="card-body bg-secondary text-white rounded-3">
                <h6>Total Profiles</h6>
                <h2>{allProfiles.length}</h2>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= TABS ================= */}
      <ul className="nav nav-tabs mb-3 mt-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "profiles" ? "active" : ""}`} onClick={() => setActiveTab("profiles")}>
            📋 All Profiles ({allProfiles.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "accounts" ? "active" : ""}`} onClick={() => setActiveTab("accounts")}>
            👑 Owner Profiles ({allUsers.length})
          </button>
        </li>
      </ul>

      {/* ================= PROFILES TAB ================= */}
      {activeTab === "profiles" && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
            <h5 className="mb-0">All User Profiles</h5>
            <button className="btn btn-success btn-sm" onClick={openAddModal}>➕ Add Profile</button>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Profile Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Owner</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProfiles.map(p => {
                  const ownerName = getOwnerName(p);
                  return (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.username || "N/A"}</td>
                      <td>{p.email}</td>
                      <td>{p.phone || "N/A"}</td>
                      <td>
                        <span className="badge bg-info text-dark">👤 {ownerName}</span>
                      </td>
                      <td>
                        <span className={`badge bg-${getBadgeColor(p.role)}`}>
                          {(p.role || "N/A").toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteRecord(p.id)}>❌</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ACCOUNTS TAB ================= */}
      {activeTab === "accounts" && (
        <div className="card">
          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">👑 Owner Profiles</h5>
            <small className="text-light">Profiles created directly via signup (parent_id IS NULL)</small>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Profile ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">No owner profiles found</td>
                  </tr>
                ) : (
                  allUsers.map(profile => (
                    <tr key={profile.id}>
                      <td><strong>{profile.id}</strong></td>
                      <td><strong>{profile.name}</strong></td>
                      <td>{profile.username || "N/A"}</td>
                      <td>{profile.email}</td>
                      <td>{profile.phone || "N/A"}</td>
                      <td>
                        <span className={`badge bg-${getBadgeColor(profile.role)}`}>
                          {(profile.role || "N/A").toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => openEdit(profile)}>✏️</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteRecord(profile.id)}>❌</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ROLE DETAILS MODAL ================= */}
      {showRoleModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className={`modal-header bg-${getBadgeColor(selectedRole)} text-white`}>
                <h5 className="modal-title">
                  {getRoleIcon(selectedRole)} {selectedRole?.toUpperCase()} Users ({roleUsers.length})
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeRoleModal} />
              </div>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {loadingRoleUsers ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                    <p className="mt-3">Loading users...</p>
                  </div>
                ) : roleUsers.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <h2>📭</h2>
                    <p>No {selectedRole} users found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>NAME</th>
                          <th>EMAIL</th>
                          <th>PHONE</th>
                          <th>PERMISSIONS</th>
                          <th>CREATED</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roleUsers.map((user) => {
                          let perms = [];
                          if (user.permissions) {
                            if (typeof user.permissions === "string") {
                              try { perms = JSON.parse(user.permissions); } catch { perms = []; }
                            } else if (Array.isArray(user.permissions)) {
                              perms = user.permissions;
                            }
                          }
                          return (
                            <tr key={user.id}>
                              <td><strong>{user.id}</strong></td>
                              <td><strong>{user.name}</strong></td>
                              <td>{user.email}</td>
                              <td>{user.phone || "N/A"}</td>
                              <td>
                                {perms.length > 0 ? (
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                                    {perms.map((p, i) => (
                                      <span key={i} className="badge bg-secondary" style={{ fontSize: "10px" }}>
                                        {p.toUpperCase()}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted" style={{ fontSize: "12px" }}>None</span>
                                )}
                              </td>
                              <td style={{ fontSize: "12px" }}>
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric', month: 'short', day: 'numeric'
                                })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <small className="text-muted me-auto">
                  Total: {roleUsers.length} {selectedRole} user{roleUsers.length !== 1 ? 's' : ''}
                </small>
                <button type="button" className={`btn btn-${getBadgeColor(selectedRole)}`} onClick={closeRoleModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD PROFILE MODAL ================= */}
      {showAddModal && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Add New Profile</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>ℹ️ Note:</strong> You ({currentUser.name}) will be the <strong>owner</strong> of this profile.
                </div>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label"><strong>Profile Name *</strong></label>
                  <input
                    className="form-control"
                    placeholder="Enter profile name"
                    value={newProfile.name}
                    onChange={e => setNewProfile({ ...newProfile, name: e.target.value })}
                  />
                </div>

                {/* Username */}
                <div className="mb-3">
                  <label className="form-label"><strong>Username</strong></label>
                  <input
                    className="form-control"
                    placeholder="Enter username (optional)"
                    value={newProfile.username}
                    onChange={e => setNewProfile({ ...newProfile, username: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label"><strong>Email *</strong></label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={newProfile.email}
                    onChange={e => setNewProfile({ ...newProfile, email: e.target.value })}
                  />
                </div>

                {/* Phone */}
                <div className="mb-3">
                  <label className="form-label"><strong>Phone</strong></label>
                  <input
                    className="form-control"
                    placeholder="Optional"
                    value={newProfile.phone}
                    onChange={e => setNewProfile({ ...newProfile, phone: e.target.value })}
                  />
                </div>

                {/* Role with + button */}
                <div className="mb-3">
                  <label className="form-label"><strong>Role *</strong></label>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={newProfile.role || ""}
                      onChange={e => setNewProfile({ ...newProfile, role: e.target.value })}
                    >
                      <option value="">-- Select Role --</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.role_name.toUpperCase()}>
                          {r.role_name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ minWidth: "45px", fontSize: "20px", fontWeight: "700" }}
                      onClick={() => { setQuickRoleName(""); setShowQuickAddRoleModal(true); }}
                      title="Add New Role"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label"><strong>Password *</strong></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    disabled={newProfile.autoGeneratePassword}
                    value={newProfile.password}
                    onChange={e => setNewProfile({ ...newProfile, password: e.target.value })}
                  />
                </div>

                {/* Auto generate password */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="autoGeneratePassword"
                      checked={newProfile.autoGeneratePassword}
                      onChange={e => setNewProfile({ ...newProfile, autoGeneratePassword: e.target.checked, password: "" })}
                    />
                    <label className="form-check-label" htmlFor="autoGeneratePassword">
                      🔐 Auto-generate strong password
                    </label>
                  </div>
                  {newProfile.autoGeneratePassword && (
                    <small className="text-muted d-block mt-1">
                      ℹ️ A random password will be generated and shown after creation
                    </small>
                  )}
                </div>

                {/* Profile Owner */}
                <div className="mb-2">
                  <label className="form-label"><strong>Profile Owner</strong></label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${currentUser.name} (You - ID: ${currentUser.id})`}
                    disabled
                    style={{ backgroundColor: "#d1ecf1", cursor: "not-allowed", fontWeight: "bold" }}
                  />
                  <small className="text-info">✅ You will be the owner of this profile</small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={addProfile}>
                  <strong>Create Profile</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && editData && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Edit Profile</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)} />
              </div>
              <div className="modal-body">
                {/* Name */}
                <div className="mb-2">
                  <label className="form-label fw-bold">Name</label>
                  <input
                    className="form-control"
                    value={editData.name || ""}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>

                {/* Username */}
                <div className="mb-2">
                  <label className="form-label fw-bold">Username</label>
                  <input
                    className="form-control"
                    value={editData.username || ""}
                    onChange={e => setEditData({ ...editData, username: e.target.value })}
                    placeholder="Enter username (optional)"
                  />
                  <small className="text-muted">Optional — used for login</small>
                </div>

                {/* Email */}
                <div className="mb-2">
                  <label className="form-label fw-bold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={editData.email || ""}
                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>

                {/* Phone */}
                <div className="mb-2">
                  <label className="form-label fw-bold">Phone</label>
                  <input
                    className="form-control"
                    value={editData.phone || ""}
                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="Enter phone (optional)"
                  />
                </div>

                {/* Role dropdown dynamic */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Role</label>
                  <select
                    className="form-select"
                    value={editData.role?.toUpperCase() || ""}
                    onChange={e => setEditData({ ...editData, role: e.target.value })}
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.role_name.toUpperCase()}>
                        {r.role_name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={updateRecord}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= QUICK ADD ROLE MODAL ================= */}
      {showQuickAddRoleModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">➕ Add New Role</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowQuickAddRoleModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Role Name *</label>
                  <input
                    className="form-control"
                    placeholder="e.g. SUPERVISOR"
                    value={quickRoleName}
                    onChange={e => setQuickRoleName(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowQuickAddRoleModal(false)}>Cancel</button>
                <button
                  className="btn btn-success"
                  onClick={async () => {
                    if (!quickRoleName.trim()) return alert("❌ Role name required!");
                    try {
                      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                      await axios.post(`${API_ROOT}/roles`, {
                        role_name: quickRoleName.trim(),
                        permissions: [],
                        created_by: currentUser.id || null
                      });
                      alert(`✅ Role "${quickRoleName}" created!`);
                      setShowQuickAddRoleModal(false);
                      setNewProfile(prev => ({ ...prev, role: quickRoleName.trim() }));
                      await fetchRoles();
                      await fetchAllData();
                    } catch (err) {
                      alert(err.response?.data?.error || "❌ Failed to create role");
                    }
                  }}
                >
                  💾 Save Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SuperAdminDashboard;