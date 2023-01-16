import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children, hasAuth }) => {
  return hasAuth ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
