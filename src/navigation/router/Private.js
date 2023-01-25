import React from 'react';
import { Navigate } from 'react-router-dom';
import { showLog } from 'utils/functions/common';

const Private = ({ children, isPrivated }) => {
  showLog({ isPrivated });
  return isPrivated ? <>{children}</> : <Navigate to="/" replace />;
};

export default Private;
