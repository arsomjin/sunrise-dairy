import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuth = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  return !!currentUser && currentUser?.uid && currentUser?.emailVerified ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

export default RequireAuth;
