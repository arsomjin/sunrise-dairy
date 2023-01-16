import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logoutAccount } from 'store/slices/userSlice';

const Logout = () => {
  useEffect(() => {
    logoutAccount();
  }, []);

  return <Navigate to="/auth/login" replace />;
};

export default Logout;
