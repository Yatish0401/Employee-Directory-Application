import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Create from "./components/Create";
import Update from "./components/Update";
import Read from "./components/Read";
import Signup from "./components/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import Forgot from "./components/Forgot";
import LoginPage from "./components/LoginPage";
import Otppage from "./components/Otppage";
import ProtectedSuperAdminRoute from "./components/ProtectedSuperAdminRoute";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import SuperAdminLogin from "./components/SuperAdminLogin";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const user = localStorage.getItem("user");
  return !user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <Forgot />
              </PublicRoute>
            }
          />
          <Route
            path="/otp-login"
            element={
              <PublicRoute>
                <Otppage />
              </PublicRoute>
            }
          />

          {/* Super Admin Routes */}
          <Route path="/superadmin-login" element={<SuperAdminLogin />} />
          <Route
            path="/superadmin-dashboard"
            element={
              <ProtectedSuperAdminRoute>
                <SuperAdminDashboard />
              </ProtectedSuperAdminRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update/:id"
            element={
              <ProtectedRoute>
                <Update />
              </ProtectedRoute>
            }
          />
          <Route
            path="/read/:id"
            element={
              <ProtectedRoute>
                <Read />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Read />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
