import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedSuperAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperAdmin = localStorage.getItem('isSuperAdmin');
  
  return (user.role === 'SUPERADMIN' && isSuperAdmin) 
    ? children 
    : <Navigate to="/superadmin-login" />;
}

export default ProtectedSuperAdminRoute;